package com.hms.pharmacy.dto;

import lombok.Data;

@Data
public class MedicineRequest {
    private String name;
    private String manufacturer;
    private double unitPrice;
    private int stockQuantity;
}
