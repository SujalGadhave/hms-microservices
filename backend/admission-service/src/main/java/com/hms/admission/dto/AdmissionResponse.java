package com.hms.admission.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdmissionResponse {
    private String id;
    private String patientId;
    private String bedId;
    private LocalDateTime admissionDate;
    private LocalDateTime dischargeDate;
    private String status;
}