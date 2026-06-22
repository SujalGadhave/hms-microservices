package com.hms.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class LoginRequest {

    @Email
    @NotBlank(message = "email is required")
    private String email;

    @NotBlank(message = "password is must required")
    private String password;
}
