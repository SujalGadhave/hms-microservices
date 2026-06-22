package com.hms.appointment.client;

import com.hms.appointment.dto.PatientResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "PATIENT-SERVICE")
public interface PatientClient {

    @GetMapping("/api/v1/patients/{id}")
    PatientResponse getByPatientId(@PathVariable("id") String patientId);

}
