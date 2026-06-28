package com.hms.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/v1/auth/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("admin-service-routes", r -> r
                        .path("/api/v1/admin/**")
                        .uri("lb://AUTH-SERVICE"))
                .route("patient-service", r -> r
                        .path("/api/v1/patients/**", "/api/v2/patients/**")
                        .uri("lb://PATIENT-SERVICE"))
                .route("appointment-service", r -> r
                        .path("/api/v1/appointments/**", "/api/v1/availability/**")
                        .uri("lb://APPOINTMENT-SERVICE"))
                .route("billing-service", r -> r
                        .path("/api/v1/invoices/**")
                        .uri("lb://BILLING-SERVICE"))
                .route("audit-service", r -> r
                        .path("/api/v1/audits/**")
                        .uri("lb://AUDIT-SERVICE"))
                .route("notification-service", r -> r
                        .path("/api/v1/notifications/**")
                        .uri("lb://NOTIFICATION-SERVICE"))
                .route("analytics-service", r -> r
                        .path("/api/v1/analytics/**")
                        .uri("lb://ANALYTICS-SERVICE"))
                .route("doctor-service", r -> r
                        .path("/api/v1/doctors/**")
                        .uri("lb://DOCTOR-SERVICE"))
                .route("pharmacy-service", r -> r
                        .path("/api/v1/medicines/**")
                        .uri("lb://PHARMACY-SERVICE"))
                .route("laboratory-service", r -> r
                        .path("/api/v1/laboratory/**")
                        .uri("lb://LABORATORY-SERVICE"))
                .route("admission-service", r -> r
                        .path("/api/v1/admissions/**")
                        .uri("lb://ADMISSION-SERVICE"))
                .route("inventory-service", r -> r
                        .path("/api/v1/inventory/**")
                        .uri("lb://INVENTORY-SERVICE"))
                .route("reporting-service", r -> r
                        .path("/api/v1/reports/**")
                        .uri("lb://REPORTING-SERVICE"))
                .build();
    }
}
