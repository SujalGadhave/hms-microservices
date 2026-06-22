package com.hms.billing;

import com.hms.billing.dto.AppointmentCreatedEvent;
import com.hms.billing.entity.Invoice;
import com.hms.billing.entity.InvoiceStatus;
import com.hms.billing.event.AuditEventProducer;
import com.hms.billing.event.BillingEventProducer;
import com.hms.billing.mapper.InvoiceMapper;
import com.hms.billing.repository.InvoiceRepository;
import com.hms.billing.service.InvoiceService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BillingServiceApplicationTests {

    @Mock
    private InvoiceRepository invoiceRepository;

    @Mock
    private BillingEventProducer billingEventProducer;

    @Mock
    private AuditEventProducer auditEventProducer;

    @Mock
    private InvoiceMapper invoiceMapper;

    @InjectMocks
    private InvoiceService invoiceService;

    @Test
    void generateInvoiceIsIdempotentPerAppointment() {
        AppointmentCreatedEvent event = new AppointmentCreatedEvent();
        event.setAppointmentId("appointment-1");
        event.setPatientId("patient-1");

        Invoice existing = Invoice.builder()
                .id("invoice-1")
                .appointmentId("appointment-1")
                .patientId("patient-1")
                .consultationFee(new BigDecimal("500.00"))
                .tax(new BigDecimal("90.00"))
                .totalAmount(new BigDecimal("590.00"))
                .status(InvoiceStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        when(invoiceRepository.findByAppointmentId("appointment-1")).thenReturn(Optional.of(existing));
        when(invoiceMapper.toResponse(existing)).thenReturn(
                com.hms.billing.dto.InvoiceResponse.builder().id("invoice-1").status(InvoiceStatus.PENDING).build()
        );

        assertThat(invoiceService.generateInvoice(event).getId()).isEqualTo("invoice-1");
    }

}
