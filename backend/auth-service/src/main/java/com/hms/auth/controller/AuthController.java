package com.hms.auth.controller;

import com.hms.auth.dto.AuthResponse;
import com.hms.auth.dto.LoginRequest;
import com.hms.auth.dto.RefreshTokenRequest;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse authResponse = authService.register(registerRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    /**
     * [MEDIUM-40] Refresh token moved from @RequestParam (URL) to @RequestBody.
     * Tokens must never appear in URLs (logged in access logs, browser history, referrer headers).
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse authResponse = authService.refreshToken(request.getRefreshToken());
        return ResponseEntity.ok(authResponse);
    }

    /**
     * [MEDIUM-39] Logout endpoint — invalidates the refresh token for the authenticated user.
     * The short-lived access token (15 min) will expire naturally.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal UserDetails userDetails) {
        authService.logout(userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
