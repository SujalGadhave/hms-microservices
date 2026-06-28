package com.hms.auth.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Enriched auth response — includes role, email, and display name so the frontend
 * never needs to manually decode the JWT (which is both insecure and fragile).
 */
@Getter
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    /** The user's role exactly as stored (e.g. ROLE_ADMIN, ROLE_DOCTOR). */
    private String role;
    private String email;
    private String firstName;
    private String lastName;
}
