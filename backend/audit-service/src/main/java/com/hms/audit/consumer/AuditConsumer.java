package com.hms.audit.consumer;

import com.hms.common.dto.AuditEvent;
import com.hms.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuditConsumer {

    private final AuditService auditService;

    @KafkaListener(
            topics = "audit-event",
            groupId = "audit-group"
    )
    public void consume(AuditEvent auditEvent) {
        log.info("Audit event received: {}", auditEvent.getAction());

        auditService.saveAudit(auditEvent);
    }

}

