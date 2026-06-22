package com.hms.pharmacy.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.pharmacy.dto.MedicineRequest;
import com.hms.pharmacy.dto.MedicineResponse;
import com.hms.pharmacy.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public ResponseEntity<ApiResponse<MedicineResponse>> addMedicine(@RequestBody MedicineRequest request) {
        return ResponseEntity.ok(ApiResponse.<MedicineResponse>builder()
                .success(true)
                .data(medicineService.addMedicine(request))
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MedicineResponse>>> getAllMedicines() {
        return ResponseEntity.ok(ApiResponse.<List<MedicineResponse>>builder()
                .success(true)
                .data(medicineService.getAllMedicines())
                .timeStamp(LocalDateTime.now())
                .build());
    }
}
