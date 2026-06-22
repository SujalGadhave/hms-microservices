package com.hms.billing.dto;

import com.hms.billing.entity.InvoiceStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class InvoiceResponse {

    private String id;
    private BigDecimal consultationFee;
    private BigDecimal tax;
    private BigDecimal totalAmount;
    private InvoiceStatus status;
}
