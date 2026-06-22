package com.hms.analytics.consumer;

import com.hms.analytics.dto.InvoicePaidEvent;
import com.hms.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BillingAnalyticsConsumer {

    private final AnalyticsService analyticsService;

    @KafkaListener(
            topics = "invoice-paid-topic",
            groupId = "analytics-group"
    )
    public void consumeInvoicePaid(InvoicePaidEvent event) {
        log.info("Analytics received invoice paid event {}", event.getInvoiceId());
        analyticsService.addRevenue(event.getTotalAmount());
    }
}
