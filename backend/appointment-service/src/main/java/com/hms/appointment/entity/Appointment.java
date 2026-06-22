package com.hms.appointment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments", indexes = {
    @Index(name = "idx_appointment_doctor_time", columnList = "doctorId, appointmentTime")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Version
    private Long version;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
