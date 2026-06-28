package com.hms.appointment.client;

import com.hms.appointment.dto.PatientResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;

@FeignClient(name = "PATIENT-SERVICE", fallback = PatientClientFallback.class)
public interface PatientClient {

    @GetMapping("/api/v1/patients/{id}")
    @CircuitBreaker(name = "patientService")
    @Retry(name = "patientService")
    PatientResponse getByPatientId(@PathVariable("id") String patientId);

}
