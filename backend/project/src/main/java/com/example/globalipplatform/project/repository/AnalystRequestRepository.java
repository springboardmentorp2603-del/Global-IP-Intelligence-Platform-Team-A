package com.example.globalipplatform.project.repository;

import com.example.globalipplatform.project.entity.AnalystRequest;
import com.example.globalipplatform.project.DTO.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnalystRequestRepository extends JpaRepository<AnalystRequest, Long> {
    List<AnalystRequest> findByStatus(RequestStatus status);
    List<AnalystRequest> findByStatusOrderBySubmittedAtDesc(RequestStatus status);
    boolean existsByEmail(String email);
}