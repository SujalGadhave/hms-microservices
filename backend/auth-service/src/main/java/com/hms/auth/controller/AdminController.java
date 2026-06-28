package com.hms.auth.controller;

import com.hms.auth.dto.AuthResponse;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.repository.UserRepository;
import com.hms.auth.entity.User;
import com.hms.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Admin-only endpoints.
 * All routes here require ROLE_ADMIN or ROLE_SUPERADMIN (enforced in SecurityConfig + @PreAuthorize).
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final UserRepository userRepository;

    /**
     * Get all registered users — admin/superadmin only.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<List<Map<String, String>>> listUsers() {
        List<Map<String, String>> users = userRepository.findAll().stream()
                .map(u -> Map.of(
                        "id",        u.getId(),
                        "email",     u.getEmail(),
                        "firstName", u.getFirstName(),
                        "lastName",  u.getLastName(),
                        "role",      u.getRole().name(),
                        "enabled",   String.valueOf(u.isEnabled())
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    /**
     * Create a user with any role (admin path).
     * This is the ONLY way to create DOCTOR, NURSE, VENDOR, ADMIN, SUPERADMIN accounts.
     */
    @PostMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<AuthResponse> createUser(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.adminCreateUser(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Enable or disable a user account.
     */
    @PatchMapping("/users/{id}/toggle-enabled")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Map<String, String>> toggleUserEnabled(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new com.hms.common.exception.BusinessException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "enabled", String.valueOf(user.isEnabled())
        ));
    }

    /**
     * Legacy dashboard endpoint — kept for backward compatibility.
     */
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<Map<String, String>> dashboard() {
        return ResponseEntity.ok(Map.of("message", "HMS Admin Dashboard"));
    }
}
