package com.hms.admission.dto;

import lombok.Data;

@Data
public class AdmissionRequest {
    private String patientId;
    private String bedId;
}