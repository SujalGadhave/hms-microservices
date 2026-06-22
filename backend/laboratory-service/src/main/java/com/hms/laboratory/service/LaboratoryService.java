package com.hms.laboratory.service;

import com.hms.laboratory.dto.LabTestRequest;
import com.hms.laboratory.dto.LabTestResponse;
import com.hms.laboratory.entity.LabTest;
import com.hms.laboratory.repository.LabTestRepository;
import com.hms.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LaboratoryService {

    private final LabTestRepository labTestRepository;

    @Transactional
    public LabTestResponse orderTest(LabTestRequest request) {
        LabTest labTest = LabTest.builder()
                .patientId(request.getPatientId())
                .testName(request.getTestName())
                .status("PENDING")
                .build();
        labTest = labTestRepository.save(labTest);
        return mapToResponse(labTest);
    }

    public List<LabTestResponse> getPatientTests(String patientId) {
        return labTestRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private LabTestResponse mapToResponse(LabTest labTest) {
        return LabTestResponse.builder()
                .id(labTest.getId())
                .patientId(labTest.getPatientId())
                .testName(labTest.getTestName())
                .status(labTest.getStatus())
                .result(labTest.getResult())
                .build();
    }
}