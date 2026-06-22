package com.hms.reporting.service;

import com.hms.reporting.dto.ReportResponse;
import org.springframework.stereotype.Service;

@Service
public class ReportingService {

    public ReportResponse generateSummaryReport() {
        return ReportResponse.builder()
                .reportType("SUMMARY")
                .content("Mocked summary report content")
                .build();
    }
}