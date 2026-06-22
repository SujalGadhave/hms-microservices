package com.hms.patientservice.controller.v2;

import com.hms.patientservice.dto.v2.PatientResponseV2;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;

@RestController
@RequestMapping("/api/v2/patients")
@RequiredArgsConstructor
public class PatientControllerV2 {

    private final PatientRepository patientRepository;

    @GetMapping("/{id}")
    public PatientResponseV2 getPatientById(
            @PathVariable String id
    ) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        int age = Period.between(
                patient.getDateOfBirth(),
                LocalDate.now()
        ).getYears();

        return PatientResponseV2.builder()
                .patientId(patient.getId())
                .fullName(
                        patient.getFirstName()
                                + " "
                                + patient.getLastName()
                )
                .email(patient.getEmail())
                .phone(patient.getPhoneNumber())
                .age(age)
                .insuranceProvider("Not Available")
                .build();
    }
}