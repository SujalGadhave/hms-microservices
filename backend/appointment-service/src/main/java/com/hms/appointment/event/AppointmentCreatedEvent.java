package com.hms.appointment.event;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreatedEvent {

    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String patientEmail;

}
