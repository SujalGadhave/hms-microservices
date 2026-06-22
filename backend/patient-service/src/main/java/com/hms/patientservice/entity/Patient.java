package com.hms.patientservice.entity;

import com.hms.common.entity.BaseEntity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false,  unique = true)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String gender;

    private String address;

    @Column(nullable = false)
    private Boolean active;
}
