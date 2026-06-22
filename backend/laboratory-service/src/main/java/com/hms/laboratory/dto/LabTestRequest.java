package com.hms.laboratory.dto;

import lombok.Data;

@Data
public class LabTestRequest {
    private String patientId;
    private String testName;
}