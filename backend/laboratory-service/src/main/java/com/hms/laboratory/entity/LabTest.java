package com.hms.laboratory.entity;

import com.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lab_tests")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabTest extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String testName;

    @Column(nullable = false)
    private String status;
    
    private String result;
}