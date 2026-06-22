package com.hms.appointment.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class AvailableSlotResponse {

    private LocalDateTime slotTime;

    private boolean booked;

}
