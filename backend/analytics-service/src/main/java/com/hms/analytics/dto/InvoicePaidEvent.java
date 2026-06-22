package com.hms.analytics.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class InvoicePaidEvent {

    private String invoiceId;
    private String appointmentId;
    private String patientId;
    private BigDecimal totalAmount;
}
