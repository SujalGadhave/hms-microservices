package com.hms.appointment.client;

import com.hms.appointment.dto.PatientResponse;
import org.springframework.stereotype.Component;

@Component
public class PatientClientFallback implements PatientClient {

    @Override
    public PatientResponse getByPatientId(String patientId) {
        // Fallback response when Patient Service is down
        PatientResponse fallbackResponse = new PatientResponse();
        fallbackResponse.setId(patientId);
        fallbackResponse.setFirstName("Unknown");
        fallbackResponse.setLastName("Patient (Service Unavailable)");
        fallbackResponse.setPhoneNumber("N/A");
        fallbackResponse.setEmail("N/A");
        return fallbackResponse;
    }
}
