package com.hms.audit.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String entityId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditAction action;

    @Column(nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private String correlationId;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 1000)
    private String details;

}
