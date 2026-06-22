package com.hms.analytics.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Builder
public class AnalyticsSummaryResponse {

    private Long totalAppointments;
    private Long totalCancelledAppointments;
    private Long totalCompletedAppointments;
    private Long totalPatientRegistrations;
    private BigDecimal totalRevenue;
    private List<DailyMetricResponse> dailyMetrics;
}
