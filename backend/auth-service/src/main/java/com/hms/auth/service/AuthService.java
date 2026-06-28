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
import com.hms.common.exception.AuthenticationException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditEventProducer auditEventProducer;

    /**
     * Roles that can be self-assigned on the public /register endpoint.
     * All privileged roles (ADMIN, DOCTOR, NURSE, VENDOR, SUPERADMIN) must be
     * assigned by an existing admin via the admin API — they cannot self-register.
     */
    private static final Set<Role> SELF_REGISTERABLE_ROLES = Set.of(Role.ROLE_PATIENT);

    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BusinessException("An account with this email already exists");
        }

        // [SECURITY] Enforce that public self-registration is PATIENT-only.
        // If any other role is requested, reject the request.
        Role requestedRole = (registerRequest.getRole() == null) ? Role.ROLE_PATIENT : registerRequest.getRole();
        if (!SELF_REGISTERABLE_ROLES.contains(requestedRole)) {
            throw new BusinessException(
                "Role '" + requestedRole + "' cannot be self-registered. " +
                "Contact an administrator to have your account created."
            );
        }

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(requestedRole)
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

        return generateToken(user);
    }

    /**
     * Admin-only path to create a user with any role.
     * Called from AdminController which is secured by ROLE_ADMIN or ROLE_SUPERADMIN.
     */
    @Transactional
    public AuthResponse adminCreateUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BusinessException("An account with this email already exists");
        }

        Role assignedRole = (registerRequest.getRole() == null) ? Role.ROLE_PATIENT : registerRequest.getRole();

        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(assignedRole)
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("auth-service")
                        .entityId(user.getEmail())
                        .action("CREATE")
                        .performedBy("admin")
                        .correlationId(UUID.randomUUID().toString())
                        .details("Admin created user with role " + user.getRole())
                        .build()
        );

        // Return the saved user info (no tokens — admin creates accounts, user logs in separately)
        return AuthResponse.builder()
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid credentials"));

        if (!user.isEnabled()) {
            throw new AuthenticationException("Account is disabled. Contact your administrator.");
        }

        boolean matches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
        if (!matches) {
            throw new AuthenticationException("Invalid credentials");
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

        return generateToken(user);
    }

    @Transactional
    public AuthResponse refreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AuthenticationException("Refresh token not found"));

        // Use consistent LocalDateTime.now() — no mixing with ZoneOffset.UTC variant
        if (refreshToken.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new AuthenticationException("Refresh token has expired");
        }
        if (!jwtService.isValid(token)) {
            throw new AuthenticationException("Refresh token signature is invalid");
        }

        User user = userRepository.findByEmail(refreshToken.getEmail())
                .orElseThrow(() -> new AuthenticationException("User not found"));

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

        return generateToken(user);
    }

    /**
     * Logout — invalidates the user's refresh token so it cannot be reused.
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

    /**
     * Generates a new access+refresh token pair for a user and returns an enriched
     * AuthResponse containing role, email, and name — so the frontend never needs to
     * manually decode the JWT.
     */
    private AuthResponse generateToken(User user) {
        String email = user.getEmail();
        String accessToken = jwtService.generateAccessToken(email, user.getRole().name());
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
                .role(user.getRole().name())
                .email(email)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }
}
