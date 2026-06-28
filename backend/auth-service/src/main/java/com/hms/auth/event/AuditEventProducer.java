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
        try {
            kafkaTemplate.send("audit-event", event);
        } catch (Exception e) {
            System.err.println("Failed to send audit event to Kafka: " + e.getMessage());
        }
    }
}

