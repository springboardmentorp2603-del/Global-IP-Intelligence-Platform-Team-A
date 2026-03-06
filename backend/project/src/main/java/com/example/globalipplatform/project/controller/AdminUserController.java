package com.example.globalipplatform.project.controller;

import com.example.globalipplatform.project.entity.User;
import com.example.globalipplatform.project.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> result = users.stream().map(user -> {
            // Derive a display status — the User entity doesn't expose an enabled flag,
            // so we use "Active" for all registered users.
            String status = "Active";
            return Map.<String, Object>of(
                    "id", user.getId(),
                    "name", user.getUsername() != null ? user.getUsername() : "",
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "role", user.getRole() != null ? user.getRole().name() : "USER",
                    "status", status);
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
