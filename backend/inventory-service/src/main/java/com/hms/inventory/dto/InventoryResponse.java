package com.hms.inventory.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryResponse {
    private String id;
    private String itemName;
    private int quantity;
    private String unit;
    private double unitPrice;
}