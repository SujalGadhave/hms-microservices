package com.hms.patientservice.event;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientCreatedEvent {

    private String patientId;

    private String email;

    private String fullName;

}
