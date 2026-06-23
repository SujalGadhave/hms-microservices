package com.hms.audit.service;

import com.hms.common.dto.AuditEvent;
import com.hms.audit.entity.AuditLog;
import com.hms.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public void saveAudit(AuditEvent auditEvent) {
        com.hms.audit.entity.AuditAction action;
        try {
            action = com.hms.audit.entity.AuditAction.valueOf(auditEvent.getAction());
        } catch (Exception e) {
            action = com.hms.audit.entity.AuditAction.UNKNOWN;
        }

        AuditLog auditLog = AuditLog.builder()
                .serviceName(auditEvent.getServiceName() == null ? "unknown-service" : auditEvent.getServiceName())
                .entityId(auditEvent.getEntityId() == null ? "unknown-entity" : auditEvent.getEntityId())
                .action(action)
                .performedBy(auditEvent.getPerformedBy() == null ? "system" : auditEvent.getPerformedBy())
                .correlationId(auditEvent.getCorrelationId() == null ? "unknown" : auditEvent.getCorrelationId())
                .details(auditEvent.getDetails())
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(auditLog);
    }

    public Page<AuditLog> getAudits(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return auditLogRepository.findAll(pageable);
    }

}
