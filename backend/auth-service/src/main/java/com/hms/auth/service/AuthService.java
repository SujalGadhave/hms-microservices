package com.hms.auth.service;

import com.hms.auth.dto.AuthResponse;
import com.hms.common.dto.AuditEvent;
import com.hms.auth.dto.LoginRequest;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.entity.RefreshToken;
import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.event.AuditEventProducer;
import com.hms.auth.repository.RefreshTokenRepository;
import com.hms.auth.repository.UserRepository;
import com.hms.auth.security.JwtService;
import com.hms.common.exception.BusinessException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditEventProducer auditEventProducer;

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            // [MEDIUM-37] Was RuntimeException (→500); BusinessException maps to 400 Conflict via GlobalExceptionHandler
            throw new BusinessException("Email already exists");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole() == null ? Role.ROLE_PATIENT : registerRequest.getRole())
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("auth-service")
                        .entityId(user.getEmail())
                        .action("CREATE")
                        .performedBy(user.getEmail())
                        .correlationId(UUID.randomUUID().toString())
                        .details("User registered with role " + user.getRole())
                        .build()
        );

        return generateToken(user.getEmail());
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                // [MEDIUM-38] Was RuntimeException (→500); BusinessException maps to 400 via GlobalExceptionHandler
                .orElseThrow(() -> new BusinessException("Invalid Credentials"));

        boolean matches = passwordEncoder
                .matches(loginRequest.getPassword(), user.getPassword());

        if (!matches) {
            throw new BusinessException("Invalid Credentials");
        }

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("auth-service")
                        .entityId(user.getEmail())
                        .action("LOGIN")
                        .performedBy(user.getEmail())
                        .correlationId(UUID.randomUUID().toString())
                        .details("User login successful")
                        .build()
        );

        return generateToken(user.getEmail());
    }

    @Transactional
    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException("Refresh token not found"));

        if (!jwtService.isValid(token) || refreshToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Invalid or expired refresh token");
        }

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("auth-service")
                        .entityId(refreshToken.getEmail())
                        .action("UPDATE")
                        .performedBy(refreshToken.getEmail())
                        .correlationId(UUID.randomUUID().toString())
                        .details("Refresh token exchanged")
                        .build()
        );

        return generateToken(refreshToken.getEmail());
    }

    @Transactional
    public AuthResponse generateToken(String email) {
        String accessToken = jwtService.generateAccessToken(email);
        String refreshToken = jwtService.generateRefreshToken(email);

        refreshTokenRepository.deleteByEmail(email);
        refreshTokenRepository.save(
                RefreshToken.builder()
                        .token(refreshToken)
                        .email(email)
                        .expiredAt(LocalDateTime.now().plus(Duration.ofMillis(jwtService.getRefreshTokenExpiration())))
                        .build()
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * [MEDIUM-39] Logout — invalidates the user's refresh token so it cannot be reused.
     * The access token is short-lived (15 min) and will naturally expire.
     */
    @Transactional
    public void logout(String email) {
        refreshTokenRepository.deleteByEmail(email);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("auth-service")
                        .entityId(email)
                        .action("LOGOUT")
                        .performedBy(email)
                        .correlationId(UUID.randomUUID().toString())
                        .details("User logged out, refresh token revoked")
                        .build()
        );
    }
}
