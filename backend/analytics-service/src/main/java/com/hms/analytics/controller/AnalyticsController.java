package com.hms.analytics.controller;

import com.hms.analytics.dto.AnalyticsSummaryResponse;
import com.hms.analytics.dto.DailyMetricResponse;
import com.hms.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/daily")
    public ResponseEntity<List<DailyMetricResponse>> getDailyMetrics(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate from,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate to
    ) {
        return ResponseEntity.ok(analyticsService.getDailyMetrics(from, to));
    }

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate from,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate to
    ) {
        return ResponseEntity.ok(analyticsService.getSummary(from, to));
    }
}
