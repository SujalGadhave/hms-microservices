package com.hms.audit.util;

import com.hms.common.dto.AuditEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(AuditEvent auditEvent) {
        kafkaTemplate.send("audit-event", auditEvent);
    }

}

