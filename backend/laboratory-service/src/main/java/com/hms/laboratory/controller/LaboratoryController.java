package com.hms.laboratory.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.laboratory.dto.LabTestRequest;
import com.hms.laboratory.dto.LabTestResponse;
import com.hms.laboratory.service.LaboratoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/laboratory")
@RequiredArgsConstructor
public class LaboratoryController {

    private final LaboratoryService laboratoryService;

    @PostMapping("/tests")
    public ResponseEntity<ApiResponse<LabTestResponse>> orderTest(@RequestBody LabTestRequest request) {
        return ResponseEntity.ok(ApiResponse.<LabTestResponse>builder()
                .success(true)
                .data(laboratoryService.orderTest(request))
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/tests/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getPatientTests(@PathVariable String patientId) {
        return ResponseEntity.ok(ApiResponse.<List<LabTestResponse>>builder()
                .success(true)
                .data(laboratoryService.getPatientTests(patientId))
                .timeStamp(LocalDateTime.now())
                .build());
    }
}