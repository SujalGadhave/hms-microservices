package com.hms.billing.consumer;

import com.hms.billing.dto.AppointmentCreatedEvent;
import com.hms.billing.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentBillingConsumer {

    private final InvoiceService invoiceService;

    @KafkaListener(
            topics = "appointment-created-topic",
            groupId = "billing-group"
    )
    public void consume(AppointmentCreatedEvent appointmentCreatedEvent) {

        log.info("Consumer received appointment created event {}", appointmentCreatedEvent);

        invoiceService.generateInvoice(appointmentCreatedEvent);

    }


}
