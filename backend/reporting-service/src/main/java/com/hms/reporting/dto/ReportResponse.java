package com.hms.reporting.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReportResponse {
    private String reportType;
    private String content;
}