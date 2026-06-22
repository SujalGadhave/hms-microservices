package com.hms.appointment.dto;

import com.hms.appointment.entity.AppointmentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AppointmentResponse {

    private String id;

    private String patientId;

    private String doctorId;

    private LocalDateTime appointmentTime;

    private AppointmentStatus status;
}
