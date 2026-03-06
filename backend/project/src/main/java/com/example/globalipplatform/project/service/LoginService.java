package com.example.globalipplatform.project.service;

import com.example.globalipplatform.project.config.JWTService;
import com.example.globalipplatform.project.config.UserPrincipal;
import com.example.globalipplatform.project.entity.User;
import com.example.globalipplatform.project.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final UserRepository userRepository;
    public LoginService(AuthenticationManager authenticationManager,
                        JWTService jwtService,
                        UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    public String authenticate(String email, String password) {
        try {
            logger.info("🔐 Attempting authentication for email: {}", email);
            
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            logger.info("✅ Authentication successful for: {}", email);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return jwtService.generateToken(new UserPrincipal(user));
        } catch (BadCredentialsException e) {
            logger.error("❌ Bad credentials for email: {}", email);
            throw new RuntimeException("Invalid email or password");
        } catch (AuthenticationException e) {
            logger.error("❌ Authentication failed: {}", e.getMessage());
            throw new RuntimeException("Authentication failed: " + e.getMessage());
        }
    }
}