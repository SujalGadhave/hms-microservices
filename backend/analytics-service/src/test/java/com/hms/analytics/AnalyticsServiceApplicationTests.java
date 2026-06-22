package com.hms.analytics;

import com.hms.analytics.entity.DailyMetric;
import com.hms.analytics.repository.DailyMetricRepository;
import com.hms.analytics.service.AnalyticsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceApplicationTests {

    @Mock
    private DailyMetricRepository repository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void incrementAppointmentsCreatesMetricWhenMissing() {
        when(repository.findByMetricDate(LocalDate.now())).thenReturn(Optional.empty());
        when(repository.save(any(DailyMetric.class))).thenAnswer(invocation -> invocation.getArgument(0));

        analyticsService.incrementAppointments();

        verify(repository, times(2)).save(any(DailyMetric.class));
    }

    @Test
    void addRevenueAccumulatesBigDecimalAmount() {
        DailyMetric metric = DailyMetric.builder()
                .metricDate(LocalDate.now())
                .appointmentCount(1L)
                .cancelledAppointments(0L)
                .completedAppointments(0L)
                .patientRegistrations(1L)
                .totalRevenue(BigDecimal.TEN)
                .build();
        when(repository.findByMetricDate(LocalDate.now())).thenReturn(Optional.of(metric));
        when(repository.save(any(DailyMetric.class))).thenAnswer(invocation -> invocation.getArgument(0));

        analyticsService.addRevenue(new BigDecimal("15.50"));

        verify(repository).save(metric);
    }

}
