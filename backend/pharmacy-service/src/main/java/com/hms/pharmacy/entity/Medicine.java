package com.hms.pharmacy.entity;

import com.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medicines")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Medicine extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String manufacturer;

    @Column(nullable = false)
    private double unitPrice;

    @Column(nullable = false)
    private int stockQuantity;
}
