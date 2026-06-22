package com.hms.reporting.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.reporting.dto.ReportResponse;
import com.hms.reporting.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ReportResponse>> getSummaryReport() {
        return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .success(true)
                .data(reportingService.generateSummaryReport())
                .timeStamp(LocalDateTime.now())
                .build());
    }
}