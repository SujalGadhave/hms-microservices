package com.hms.auth;

import com.hms.auth.dto.AuthResponse;
import com.hms.auth.event.AuditEventProducer;
import com.hms.auth.dto.RegisterRequest;
import com.hms.auth.entity.RefreshToken;
import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.repository.RefreshTokenRepository;
import com.hms.auth.repository.UserRepository;
import com.hms.auth.security.JwtService;
import com.hms.auth.service.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceApplicationTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuditEventProducer auditEventProducer;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerAssignsDefaultRoleAndStoresRefreshToken() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("patient@example.com");
        request.setPassword("password");

        when(userRepository.existsByEmail("patient@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(jwtService.generateAccessToken("patient@example.com")).thenReturn("access-token");
        when(jwtService.generateRefreshToken("patient@example.com")).thenReturn("refresh-token");
        when(jwtService.getRefreshTokenExpiration()).thenReturn(60000L);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        verify(userRepository).save(any(User.class));
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void refreshTokenRequiresPersistedToken() {
        when(refreshTokenRepository.findByToken("missing-token")).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
                RuntimeException.class,
                () -> authService.refreshToken("missing-token")
        );
    }
}
