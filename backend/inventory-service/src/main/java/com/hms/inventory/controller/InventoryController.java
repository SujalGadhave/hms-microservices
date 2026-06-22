package com.hms.inventory.controller;

import com.hms.common.dto.ApiResponse;
import com.hms.inventory.dto.InventoryRequest;
import com.hms.inventory.dto.InventoryResponse;
import com.hms.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryResponse>> addItem(@RequestBody InventoryRequest request) {
        return ResponseEntity.ok(ApiResponse.<InventoryResponse>builder()
                .success(true)
                .data(inventoryService.addItem(request))
                .timeStamp(LocalDateTime.now())
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.<List<InventoryResponse>>builder()
                .success(true)
                .data(inventoryService.getAllItems())
                .timeStamp(LocalDateTime.now())
                .build());
    }
}