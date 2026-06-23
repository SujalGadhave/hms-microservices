package com.hms.analytics.service;

import com.hms.analytics.dto.AnalyticsSummaryResponse;
import com.hms.analytics.dto.DailyMetricResponse;
import com.hms.analytics.entity.DailyMetric;
import com.hms.analytics.repository.DailyMetricRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DailyMetricRepository repository;

    @Transactional
    public void incrementAppointments() {
        getOrCreateTodayMetric();
        repository.incrementAppointmentCount(LocalDate.now());
    }

    @Transactional
    public void incrementPatientRegistrations() {
        getOrCreateTodayMetric();
        repository.incrementPatientRegistrations(LocalDate.now());
    }

    @Transactional
    public void addRevenue(BigDecimal amount) {
        getOrCreateTodayMetric();
        repository.addRevenue(amount, LocalDate.now());
    }

    @Cacheable(value = "analytics.daily", key = "#from.toString().concat(':').concat(#to.toString())")
    public List<DailyMetricResponse> getDailyMetrics(LocalDate from, LocalDate to) {
        return repository.findAllByMetricDateBetweenOrderByMetricDateAsc(from, to).stream()
                .map(this::toResponse)
                .toList();
    }

    @Cacheable(value = "analytics.summary", key = "#from.toString().concat(':').concat(#to.toString())")
    public AnalyticsSummaryResponse getSummary(LocalDate from, LocalDate to) {
        List<DailyMetric> metrics = repository.findAllByMetricDateBetweenOrderByMetricDateAsc(from, to);

        return AnalyticsSummaryResponse.builder()
                .totalAppointments(metrics.stream().mapToLong(DailyMetric::getAppointmentCount).sum())
                .totalCancelledAppointments(metrics.stream().mapToLong(DailyMetric::getCancelledAppointments).sum())
                .totalCompletedAppointments(metrics.stream().mapToLong(DailyMetric::getCompletedAppointments).sum())
                .totalPatientRegistrations(metrics.stream().mapToLong(DailyMetric::getPatientRegistrations).sum())
                .totalRevenue(metrics.stream()
                        .map(DailyMetric::getTotalRevenue)
                        .reduce(BigDecimal.ZERO, BigDecimal::add))
                .dailyMetrics(metrics.stream().map(this::toResponse).toList())
                .build();
    }

    private DailyMetricResponse toResponse(DailyMetric metric) {
        return DailyMetricResponse.builder()
                .metricDate(metric.getMetricDate())
                .appointmentCount(metric.getAppointmentCount())
                .cancelledAppointments(metric.getCancelledAppointments())
                .completedAppointments(metric.getCompletedAppointments())
                .patientRegistrations(metric.getPatientRegistrations())
                .totalRevenue(metric.getTotalRevenue())
                .build();
    }

    private DailyMetric getOrCreateTodayMetric() {

        return repository
                .findByMetricDate(LocalDate.now())
                .orElseGet(() ->

                        repository.save(

                                DailyMetric.builder()
                                        .metricDate(LocalDate.now())
                                        .appointmentCount(0L)
                                        .cancelledAppointments(0L)
                                        .completedAppointments(0L)
                                        .patientRegistrations(0L)
                                        .totalRevenue(BigDecimal.ZERO)
                                        .build()
                        ));
    }
}
