package com.hms.common.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent {
    private String serviceName;
    private String entityId;
    private String action;
    private String performedBy;
    private String correlationId;
    private String details;
}
