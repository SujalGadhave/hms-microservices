package com.hms.analytics.consumer;

import com.hms.analytics.dto.PatientCreatedEvent;
import com.hms.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PatientAnalyticsConsumer {

    private final AnalyticsService analyticsService;

    @KafkaListener(
            topics = "patient-created-topic",
            groupId = "analytics-group"
    )
    public void consumePatientCreated(PatientCreatedEvent event) {
        log.info("Analytics received patient created event {}", event.getPatientId());
        analyticsService.incrementPatientRegistrations();
    }
}
