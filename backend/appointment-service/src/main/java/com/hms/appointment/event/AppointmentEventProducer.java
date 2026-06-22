package com.hms.appointment.event;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AppointmentEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishAppointmentCreated(AppointmentCreatedEvent event) {
        kafkaTemplate.send("appointment-created-topic", event);
    }
}
