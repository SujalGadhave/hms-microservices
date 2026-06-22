package com.hms.analytics.repository;

import com.hms.analytics.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyMetricRepository
        extends JpaRepository<DailyMetric, String> {

    Optional<DailyMetric> findByMetricDate(
            LocalDate metricDate
    );

    List<DailyMetric> findAllByMetricDateBetweenOrderByMetricDateAsc(LocalDate from, LocalDate to);
}
