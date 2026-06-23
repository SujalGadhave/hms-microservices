package com.hms.billing.service;

import com.hms.billing.dto.AppointmentCreatedEvent;
import com.hms.common.dto.AuditEvent;
import com.hms.billing.dto.InvoiceResponse;
import com.hms.billing.dto.InvoicePaidEvent;
import com.hms.billing.entity.Invoice;
import com.hms.billing.entity.InvoiceStatus;
import com.hms.billing.event.AuditEventProducer;
import com.hms.billing.event.BillingEventProducer;
import com.hms.billing.mapper.InvoiceMapper;
import com.hms.billing.repository.InvoiceRepository;
import com.hms.billing.util.PDFInvoiceGenerator;
import com.hms.billing.util.TaxCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import com.hms.common.util.CorrelationIdUtil;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final BillingEventProducer billingEventProducer;
    private final AuditEventProducer auditEventProducer;
    private final InvoiceMapper invoiceMapper;

    @Transactional
    public InvoiceResponse generateInvoice(AppointmentCreatedEvent event) {
        Invoice existing = invoiceRepository.findByAppointmentId(event.getAppointmentId()).orElse(null);
        if (existing != null) {
            return invoiceMapper.toResponse(existing);
        }

        BigDecimal consultationFee = new BigDecimal("500.00");

        BigDecimal tax = TaxCalculator.calculateTax(consultationFee);

        BigDecimal total = consultationFee.add(tax);

        Invoice invoice = Invoice.builder()
                .patientId(event.getPatientId())
                .appointmentId(event.getAppointmentId())
                .consultationFee(consultationFee)
                .tax(tax)
                .totalAmount(total)
                .status(InvoiceStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Invoice saved = invoiceRepository.save(invoice);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("billing-service")
                        .entityId(saved.getId())
                        .action("CREATE")
                        .performedBy("system")
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Invoice generated for appointment " + saved.getAppointmentId())
                        .build()
        );

        return invoiceMapper.toResponse(saved);
    }

    @Transactional
    public InvoiceResponse markAsPaid(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            return invoiceMapper.toResponse(invoice);
        }

        invoice.setStatus(InvoiceStatus.PAID);

        Invoice updated = invoiceRepository.save(invoice);

        billingEventProducer.publishInvoicePaid(
                InvoicePaidEvent.builder()
                        .invoiceId(updated.getId())
                        .appointmentId(updated.getAppointmentId())
                        .patientId(updated.getPatientId())
                        .totalAmount(updated.getTotalAmount())
                        .build()
        );

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("billing-service")
                        .entityId(updated.getId())
                        .action("PAYMENT")
                        .performedBy("system")
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Invoice marked as paid")
                        .build()
        );

        return invoiceMapper.toResponse(updated);
    }

    @Transactional
    public InvoiceResponse getInvoice(String id) {
        return invoiceMapper.toResponse(
                invoiceRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Invoice not found"))
        );
    }

    @Transactional
    public Page<InvoiceResponse> getInvoices(int page, int size) {
        return invoiceRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(invoiceMapper::toResponse);
    }

    @Transactional
    public byte[] generatePdf(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found"));
        return PDFInvoiceGenerator.generate(invoice);
    }

}

