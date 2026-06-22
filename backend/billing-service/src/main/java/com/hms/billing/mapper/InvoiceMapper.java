package com.hms.billing.mapper;

import com.hms.billing.dto.InvoiceResponse;
import com.hms.billing.entity.Invoice;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(Invoice invoice) {
        return InvoiceResponse.builder()
                .id(invoice.getId())
                .consultationFee(invoice.getConsultationFee())
                .tax(invoice.getTax())
                .totalAmount(invoice.getTotalAmount())
                .status(invoice.getStatus())
                .build();
    }
}
