package com.hms.analytics.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Builder
public class DailyMetricResponse {

    private LocalDate metricDate;
    private Long appointmentCount;
    private Long cancelledAppointments;
    private Long completedAppointments;
    private Long patientRegistrations;
    private BigDecimal totalRevenue;
}
