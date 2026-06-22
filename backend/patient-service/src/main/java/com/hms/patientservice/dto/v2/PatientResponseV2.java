package com.hms.patientservice.dto.v2;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PatientResponseV2 {

    private String patientId;

    private String fullName;

    private String email;

    private String phone;

    private Integer age;

    private String insuranceProvider;
}