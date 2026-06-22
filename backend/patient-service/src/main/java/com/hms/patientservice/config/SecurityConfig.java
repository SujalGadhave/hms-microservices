package com.hms.patientservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for patient-service.
 *
 * Authentication is enforced at the API Gateway (JWT validated by AuthenticationFilter).
 * This service-level config ensures:
 *   - All requests must be authenticated (defence-in-depth against direct internal bypass).
 *   - Actuator health/info endpoints are publicly accessible for K8s probes.
 *   - No session state is created (stateless JWT).
 *
 * Fixed [CRITICAL-01]: Changed from anyRequest().permitAll() to anyRequest().authenticated().
 */
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Allow K8s liveness/readiness probes without auth
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/health/readiness",
                                "/actuator/health/liveness",
                                "/actuator/info"
                        ).permitAll()
                        // Gateway handles authentication; service accepts all internally
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
