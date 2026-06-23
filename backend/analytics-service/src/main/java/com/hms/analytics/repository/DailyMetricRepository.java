package com.hms.analytics.repository;

import com.hms.analytics.entity.DailyMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyMetricRepository
        extends JpaRepository<DailyMetric, String> {

    Optional<DailyMetric> findByMetricDate(
            LocalDate metricDate
    );

    List<DailyMetric> findAllByMetricDateBetweenOrderByMetricDateAsc(LocalDate from, LocalDate to);

    @Modifying
    @Query("UPDATE DailyMetric d SET d.appointmentCount = d.appointmentCount + 1 WHERE d.metricDate = :metricDate")
    void incrementAppointmentCount(@Param("metricDate") LocalDate metricDate);

    @Modifying
    @Query("UPDATE DailyMetric d SET d.patientRegistrations = d.patientRegistrations + 1 WHERE d.metricDate = :metricDate")
    void incrementPatientRegistrations(@Param("metricDate") LocalDate metricDate);

    @Modifying
    @Query("UPDATE DailyMetric d SET d.totalRevenue = d.totalRevenue + :amount WHERE d.metricDate = :metricDate")
    void addRevenue(@Param("amount") BigDecimal amount, @Param("metricDate") LocalDate metricDate);
}
