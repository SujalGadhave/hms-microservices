package com.hms.admission.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.admission.dto.AdmissionRequest;
import com.hms.admission.dto.AdmissionResponse;
import com.hms.admission.service.AdmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admissions")
@RequiredArgsConstructor
public class AdmissionController {

    private final AdmissionService admissionService;

    @PostMapping
    public ResponseEntity<ApiResponse<AdmissionResponse>> createAdmission(@RequestBody AdmissionRequest request) {
        return ResponseEntity.ok(ApiResponse.<AdmissionResponse>builder()
                .success(true)
                .data(admissionService.createAdmission(request))
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AdmissionResponse>>> getPatientAdmissions(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.<List<AdmissionResponse>>builder()
                .success(true)
                .data(admissionService.getPatientAdmissions(patientId))
                .timeStamp(LocalDateTime.now())
                .build());
    }
}