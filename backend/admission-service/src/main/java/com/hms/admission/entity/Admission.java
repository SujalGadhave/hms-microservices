package com.hms.admission.entity;

import com.hms.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admissions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Admission extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "clinic_id", nullable = false)
    private String clinicId;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String bedId;

    @Column(nullable = false)
    private LocalDateTime admissionDate;

    private LocalDateTime dischargeDate;
    
    private String status;
}