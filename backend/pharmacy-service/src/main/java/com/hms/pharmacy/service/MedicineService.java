package com.hms.pharmacy.service;

import com.hms.pharmacy.dto.MedicineRequest;
import com.hms.pharmacy.dto.MedicineResponse;
import com.hms.pharmacy.entity.Medicine;
import com.hms.pharmacy.repository.MedicineRepository;
import com.hms.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;

    @Transactional
    public MedicineResponse addMedicine(MedicineRequest request) {
        Medicine medicine = Medicine.builder()
                .name(request.getName())
                .manufacturer(request.getManufacturer())
                .unitPrice(request.getUnitPrice())
                .stockQuantity(request.getStockQuantity())
                .build();
        medicine = medicineRepository.save(medicine);
        return mapToResponse(medicine);
    }

    public List<MedicineResponse> getAllMedicines() {
        return medicineRepository.findAll(PageRequest.of(0, 1000)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MedicineResponse mapToResponse(Medicine medicine) {
        return MedicineResponse.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .manufacturer(medicine.getManufacturer())
                .unitPrice(medicine.getUnitPrice())
                .stockQuantity(medicine.getStockQuantity())
                .build();
    }
}
