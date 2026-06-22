package com.hms.auth.event;

import com.hms.common.dto.AuditEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publish(AuditEvent event) {
        kafkaTemplate.send("audit-event", event);
    }
}

