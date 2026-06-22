package com.hms.notification.consumer;

import com.hms.notification.dto.AppointmentCreatedEvent;
import com.hms.notification.service.EmailService;
import com.hms.notification.util.EmailTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.retry.annotation.Backoff;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentConsumer {

    private final EmailService emailService;

    /**
     * [MEDIUM-42] Added exponential backoff: 2s → 4s → 8s between retry attempts.
     * Without backoff, all 3 retries fire immediately and can overwhelm the email provider.
     * dltTopicSuffix matches DLQConsumer which listens on 'appointment-created-topic-dlt'.
     */
    @RetryableTopic(
            attempts = "3",
            backoff = @Backoff(delay = 2000, multiplier = 2.0),
            dltTopicSuffix = "-dlt"
    )
    @KafkaListener(
            topics = "appointment-created-topic",
            groupId = "notification-group"
    )
    public void consume(AppointmentCreatedEvent event) {
        log.info("Received appointment event: {}", event.getAppointmentId());

        emailService.sendMail(
                event.getPatientEmail(),
                "Appointment Confirmation",
                EmailTemplate.appointmentConfirmation(
                        event.getAppointmentId(),
                        event.getDoctorId()
                )
        );
    }
}
