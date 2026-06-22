package com.hms.patientservice.event;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PatientEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPatientCreated (PatientCreatedEvent event){
        kafkaTemplate.send("patient-created-topic", event);
    }

}
