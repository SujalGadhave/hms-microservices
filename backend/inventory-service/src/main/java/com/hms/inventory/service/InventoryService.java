package com.hms.inventory.service;

import com.hms.inventory.dto.InventoryRequest;
import com.hms.inventory.dto.InventoryResponse;
import com.hms.inventory.entity.InventoryItem;
import com.hms.inventory.repository.InventoryItemRepository;
import com.hms.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryItemRepository inventoryRepository;

    @Transactional
    public InventoryResponse addItem(InventoryRequest request) {
        InventoryItem item = inventoryRepository.findByItemName(request.getItemName())
                .orElse(InventoryItem.builder()
                        .itemName(request.getItemName())
                        .quantity(0)
                        .unit(request.getUnit())
                        .unitPrice(request.getUnitPrice())
                        .build());
                        
        item.setQuantity(item.getQuantity() + request.getQuantity());
        item.setUnitPrice(request.getUnitPrice()); // Update to latest price
        
        item = inventoryRepository.save(item);
        return mapToResponse(item);
    }

    public List<InventoryResponse> getAllItems() {
        return inventoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private InventoryResponse mapToResponse(InventoryItem item) {
        return InventoryResponse.builder()
                .id(item.getId())
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .unit(item.getUnit())
                .unitPrice(item.getUnitPrice())
                .build();
    }
}