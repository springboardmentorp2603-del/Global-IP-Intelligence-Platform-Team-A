package com.example.globalipplatform.project.service;

import com.example.globalipplatform.project.DTO.*;
import com.example.globalipplatform.project.entity.AnalystRequest;
import com.example.globalipplatform.project.entity.User;
import com.example.globalipplatform.project.repository.AnalystRequestRepository;
import com.example.globalipplatform.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AnalystRegistrationService {

    private final AnalystRequestRepository analystRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public AnalystRegistrationService(
            AnalystRequestRepository analystRequestRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {
        this.analystRequestRepository = analystRequestRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public AnalystRequest submitRequest(AnalystRequestDTO requestDTO) throws IOException {
        // Validate inputs
        if (requestDTO.getFirstName() == null || requestDTO.getFirstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (requestDTO.getLastName() == null || requestDTO.getLastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (requestDTO.getEmail() == null || requestDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (requestDTO.getPassword() == null || requestDTO.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (requestDTO.getCredentialType() == null || requestDTO.getCredentialType().trim().isEmpty()) {
            throw new IllegalArgumentException("Credential type is required");
        }
        if (requestDTO.getCredentialNumber() == null || requestDTO.getCredentialNumber().trim().isEmpty()) {
            throw new IllegalArgumentException("Credential number is required");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        if (analystRequestRepository.existsByEmail(requestDTO.getEmail())) {
            throw new IllegalArgumentException("A request with this email is already pending");
        }

        AnalystRequest request = new AnalystRequest();
        request.setFirstName(requestDTO.getFirstName());
        request.setLastName(requestDTO.getLastName());
        request.setEmail(requestDTO.getEmail());
        request.setPassword(passwordEncoder.encode(requestDTO.getPassword()));
        request.setCredentialType(requestDTO.getCredentialType());
        request.setCredentialNumber(requestDTO.getCredentialNumber());
        request.setStatus(RequestStatus.PENDING);
        request.setSubmittedAt(LocalDateTime.now());

        // Save uploaded files
        String requestFolder = UUID.randomUUID().toString();
        
        if (requestDTO.getPatentAgentLicense() != null && !requestDTO.getPatentAgentLicense().isEmpty()) {
            String path = saveFile(requestDTO.getPatentAgentLicense(), requestFolder, "patent_license");
            request.setPatentAgentLicensePath(path);
        }
        
        if (requestDTO.getLawCouncilId() != null && !requestDTO.getLawCouncilId().isEmpty()) {
            String path = saveFile(requestDTO.getLawCouncilId(), requestFolder, "law_council");
            request.setLawCouncilIdPath(path);
        }
        
        if (requestDTO.getCompanyProof() != null && !requestDTO.getCompanyProof().isEmpty()) {
            String path = saveFile(requestDTO.getCompanyProof(), requestFolder, "company_proof");
            request.setCompanyProofPath(path);
        }
        
        if (requestDTO.getResearchInstitutionProof() != null && !requestDTO.getResearchInstitutionProof().isEmpty()) {
            String path = saveFile(requestDTO.getResearchInstitutionProof(), requestFolder, "research_proof");
            request.setResearchInstitutionProofPath(path);
        }

        AnalystRequest savedRequest = analystRequestRepository.save(request);
        
        // Send confirmation email (if email service is configured)
        try {
            emailService.sendEmail(
                requestDTO.getEmail(),
                "Analyst Registration Request Received",
                "Dear " + requestDTO.getFirstName() + ",\n\n" +
                "Your request for Analyst registration has been submitted successfully.\n" +
                "Request ID: " + savedRequest.getId() + "\n" +
                "Submitted: " + LocalDateTime.now() + "\n\n" +
                "You will be notified once it is reviewed by our admin team.\n\n" +
                "Thank you,\nGlobal IP Intelligence Team"
            );
        } catch (Exception e) {
            // Log email error but don't fail the registration
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return savedRequest;
    }

    private String saveFile(MultipartFile file, String folder, String prefix) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, folder);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = prefix + "_" + System.currentTimeMillis() + extension;
        
        // Save file
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        return folder + "/" + fileName;
    }

    public List<AnalystRequestResponseDTO> getPendingRequests() {
        List<AnalystRequest> requests = analystRequestRepository.findByStatusOrderBySubmittedAtDesc(RequestStatus.PENDING);
        return convertToDTO(requests);
    }

    public List<AnalystRequestResponseDTO> getAllRequests() {
        List<AnalystRequest> requests = analystRequestRepository.findAll();
        return convertToDTO(requests);
    }

    public AnalystRequestResponseDTO reviewRequest(ReviewRequestDTO reviewDTO, Long adminId) {
        AnalystRequest request = analystRequestRepository.findById(reviewDTO.getRequestId())
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setReviewedAt(LocalDateTime.now());
        request.setReviewedBy(adminId);
        request.setStatus(reviewDTO.isApproved() ? RequestStatus.APPROVED : RequestStatus.REJECTED);

        if (!reviewDTO.isApproved()) {
            request.setRejectionReason(reviewDTO.getRejectionReason());
            analystRequestRepository.save(request);
            
            // Send rejection email
            try {
                emailService.sendEmail(
                    request.getEmail(),
                    "Analyst Registration Request Update",
                    "Dear " + request.getFirstName() + ",\n\n" +
                    "Your request for Analyst registration has been reviewed.\n" +
                    "Status: REJECTED\n" +
                    "Reason: " + reviewDTO.getRejectionReason() + "\n\n" +
                    "You can contact our support team for more information.\n\n" +
                    "Thank you,\nGlobal IP Intelligence Team"
                );
            } catch (Exception e) {
                System.err.println("Failed to send email: " + e.getMessage());
            }
            
            return convertToDTO(request);
        }

        // Create user account for approved analyst
        User newAnalyst = new User();
        newAnalyst.setUsername(request.getFirstName() + " " + request.getLastName());
        newAnalyst.setEmail(request.getEmail());
        newAnalyst.setPassword(request.getPassword()); // Already encoded
        newAnalyst.setRole(Role.ANALYST);
        newAnalyst.setCreatedAt(LocalDateTime.now());
        
        userRepository.save(newAnalyst);
        request.setStatus(RequestStatus.APPROVED);
        analystRequestRepository.save(request);

        // Send approval email
        try {
            emailService.sendEmail(
                request.getEmail(),
                "Analyst Registration Approved!",
                "Dear " + request.getFirstName() + ",\n\n" +
                "Congratulations! Your request for Analyst registration has been approved.\n\n" +
                "You can now log in with your credentials:\n" +
                "Email: " + request.getEmail() + "\n" +
                "Role: ANALYST\n\n" +
                "Login at: http://localhost:3000/login\n\n" +
                "Thank you,\nGlobal IP Intelligence Team"
            );
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }

        return convertToDTO(request);
    }

    private List<AnalystRequestResponseDTO> convertToDTO(List<AnalystRequest> requests) {
        List<AnalystRequestResponseDTO> dtos = new ArrayList<>();
        for (AnalystRequest request : requests) {
            dtos.add(convertToDTO(request));
        }
        return dtos;
    }

    private AnalystRequestResponseDTO convertToDTO(AnalystRequest request) {
    List<String> documents = new ArrayList<>();
    if (request.getPatentAgentLicensePath() != null) {
        documents.add("Patent Agent License");
    }
    if (request.getLawCouncilIdPath() != null) {
        documents.add("Law Council ID");
    }
    if (request.getCompanyProofPath() != null) {
        documents.add("Company Proof");
    }
    if (request.getResearchInstitutionProofPath() != null) {
        documents.add("Research Institution Proof");
    }

    return new AnalystRequestResponseDTO(
        request.getId(),
        request.getFirstName(),
        request.getLastName(),
        request.getEmail(),
        request.getCredentialType(),
        request.getCredentialNumber(),
        request.getStatus().toString(),
        request.getSubmittedAt(),
        documents,
        request.getPatentAgentLicensePath(),  
        request.getLawCouncilIdPath(),        
        request.getCompanyProofPath(),        
        request.getResearchInstitutionProofPath() 
    );
}
}