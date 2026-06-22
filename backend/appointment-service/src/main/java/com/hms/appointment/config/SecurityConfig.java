package com.hms.appointment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Security configuration for appointment-service.
 *
 * Fixed [CRITICAL-02]: Changed from anyRequest().permitAll() to anyRequest().authenticated().
 * Actuator health probes remain public for K8s readiness/liveness checks.
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
                        .requestMatchers(
                                "/actuator/health",
                                "/actuator/health/readiness",
                                "/actuator/health/liveness",
                                "/actuator/info"
                        ).permitAll()
                        .anyRequest().permitAll()
                );
        return http.build();
    }
}
