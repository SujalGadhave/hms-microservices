package com.hms.patientservice.controller.v1;

import com.hms.patientservice.dto.PatientRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientControllerV1 {

    private final PatientService patientService;

    /**
     * [HIGH-15] Fixed: Returns 201 Created instead of 200 OK.
     */
    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(
            @Valid @RequestBody PatientRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(patientService.createPatient(request));
    }

    @GetMapping
    public ResponseEntity<Page<PatientResponse>> getPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        return ResponseEntity.ok(patientService.getPatients(page, size, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponse> getPatientById(
            @PathVariable String id
    ) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    /**
     * [HIGH-16] Fixed: Returns 204 No Content instead of 200 OK with empty body.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable String id
    ) {
        patientService.softDeletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
