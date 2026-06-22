package com.hms.inventory.dto;

import lombok.Data;

@Data
public class InventoryRequest {
    private String itemName;
    private int quantity;
    private String unit;
    private double unitPrice;
}