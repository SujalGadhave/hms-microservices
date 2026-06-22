package com.hms.notification.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class DLQConsumer {

    @KafkaListener(
            topics = "appointment-created-topic-dlt"
    )
    public void consumeDeadLetter(String message) {
        log.error("Dead letter received: {}", message);
    }

}
