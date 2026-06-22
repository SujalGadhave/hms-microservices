package com.hms.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class CreateAvailabilityRequest {

    @NotBlank
    private String doctorId;

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotNull
    private LocalTime startTime;

    @NotNull
    private LocalTime endTime;

    @NotNull
    private LocalTime breakStartTime;

    @NotNull
    private LocalTime breakEndTime;

    @NotNull
    @Positive
    private Integer slotDurationMinutes;

}
