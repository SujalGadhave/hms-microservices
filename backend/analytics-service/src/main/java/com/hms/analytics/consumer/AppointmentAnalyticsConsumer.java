package com.hms.analytics.consumer;

import com.hms.analytics.dto.AppointmentCreatedEvent;
import com.hms.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentAnalyticsConsumer {

    private final AnalyticsService analyticsService;

    @KafkaListener(
            topics = "appointment-created-topic",
            groupId = "analytics-group"
    )
    public void consumeAppointmentCreated(AppointmentCreatedEvent event) {
        log.info("Analytics received appointment event {}", event.getAppointmentId());
        analyticsService.incrementAppointments();
    }
}
