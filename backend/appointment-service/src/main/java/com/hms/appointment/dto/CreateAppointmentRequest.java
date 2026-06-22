package com.hms.appointment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateAppointmentRequest {

    @NotBlank
    private String patientId;

    @NotBlank
    private String doctorId;

    @Future
    @NotNull
    private LocalDateTime appointmentTime;

}
