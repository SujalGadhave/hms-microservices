package com.hms.notification.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppointmentCreatedEvent {


    private String appointmentId;

    private String patientId;

    private String doctorId;

    private String patientEmail;

}
