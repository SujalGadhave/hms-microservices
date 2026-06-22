package com.hms.analytics.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(
        name = "daily_metrics",
        uniqueConstraints = @UniqueConstraint(name = "ux_daily_metrics_metric_date", columnNames = "metric_date")
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyMetric {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "metric_date", nullable = false, unique = true)
    private LocalDate metricDate;

    @Column(name = "appointment_count", nullable = false)
    private Long appointmentCount;

    @Column(name = "cancelled_appointments", nullable = false)
    private Long cancelledAppointments;

    @Column(name = "completed_appointments", nullable = false)
    private Long completedAppointments;

    @Column(name = "patient_registrations", nullable = false)
    private Long patientRegistrations;

    @Column(name = "total_revenue", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalRevenue;
}
