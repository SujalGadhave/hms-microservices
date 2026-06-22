package com.hms.billing.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class InvoicePaidEvent {

    private String invoiceId;
    private String appointmentId;
    private String patientId;
    private BigDecimal totalAmount;
}
