package com.hms.analytics.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientCreatedEvent {

    private String patientId;
    private String email;
    private String fullName;
}
