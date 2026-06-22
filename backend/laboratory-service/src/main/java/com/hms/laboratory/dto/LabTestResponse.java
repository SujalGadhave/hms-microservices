package com.hms.laboratory.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LabTestResponse {
    private String id;
    private String patientId;
    private String testName;
    private String status;
    private String result;
}