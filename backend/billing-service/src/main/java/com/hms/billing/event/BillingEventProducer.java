package com.hms.billing.event;

import com.hms.billing.dto.InvoicePaidEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BillingEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishInvoicePaid(InvoicePaidEvent event) {
        kafkaTemplate.send("invoice-paid-topic", event);
    }
}
