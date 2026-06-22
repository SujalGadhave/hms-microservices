package com.hms.pharmacy.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MedicineResponse {
    private String id;
    private String name;
    private String manufacturer;
    private double unitPrice;
    private int stockQuantity;
}
