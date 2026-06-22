package com.hms.inventory.entity;

import com.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String itemName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private String unit;
    
    private double unitPrice;
}