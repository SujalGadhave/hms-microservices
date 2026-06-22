package com.hms.gateway.config;

import com.hms.gateway.security.AuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

    private final AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("admin-service-routes", r -> r
                        .path("/api/v1/admin/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://AUTH-SERVICE"))
                .route("patient-service", r -> r
                        .path("/api/v1/patients/**", "/api/v2/patients/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://PATIENT-SERVICE"))
                .route("appointment-service", r -> r
                        .path("/api/v1/appointments/**", "/api/v1/availability/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://APPOINTMENT-SERVICE"))
                .route("billing-service", r -> r
                        .path("/api/v1/invoices/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://BILLING-SERVICE"))
                .route("audit-service", r -> r
                        .path("/api/v1/audits/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://AUDIT-SERVICE"))
                .route("notification-service", r -> r
                        .path("/api/v1/notifications/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://NOTIFICATION-SERVICE"))
                .route("analytics-service", r -> r
                        .path("/api/v1/analytics/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://ANALYTICS-SERVICE"))
                .route("doctor-service", r -> r
                        .path("/api/v1/doctors/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://DOCTOR-SERVICE"))
                .route("pharmacy-service", r -> r
                        .path("/api/v1/medicines/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://PHARMACY-SERVICE"))
                .route("laboratory-service", r -> r
                        .path("/api/v1/laboratory/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://LABORATORY-SERVICE"))
                .route("admission-service", r -> r
                        .path("/api/v1/admissions/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://ADMISSION-SERVICE"))
                .route("inventory-service", r -> r
                        .path("/api/v1/inventory/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://INVENTORY-SERVICE"))
                .route("reporting-service", r -> r
                        .path("/api/v1/reports/**")
                        .filters(f -> f.filter(authenticationFilter))
                        .uri("lb://REPORTING-SERVICE"))
                .build();
    }

}
