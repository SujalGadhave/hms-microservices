package com.hms.doctor.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.doctor.dto.DoctorRequest;
import com.hms.doctor.dto.DoctorResponse;
import com.hms.doctor.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@RequestBody DoctorRequest request) {
        return ResponseEntity.ok(ApiResponse.<DoctorResponse>builder()
                .success(true)
                .data(doctorService.createDoctor(request))
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.<List<DoctorResponse>>builder()
                .success(true)
                .data(doctorService.getAllDoctors())
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.<DoctorResponse>builder()
                .success(true)
                .data(doctorService.getDoctorById(id))
                .timeStamp(LocalDateTime.now())
                .build());
    }
}
