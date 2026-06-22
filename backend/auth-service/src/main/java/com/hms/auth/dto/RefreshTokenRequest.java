package com.hms.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * Request body for POST /api/v1/auth/refresh.
 *
 * [MEDIUM-40] Refresh token is now passed in the request body, not as a URL query parameter,
 * to prevent token exposure in server access logs, browser history, and HTTP referrer headers.
 */
@Getter
@Setter
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
