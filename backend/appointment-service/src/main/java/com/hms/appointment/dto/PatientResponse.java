package com.hms.appointment.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientResponse {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;

}
