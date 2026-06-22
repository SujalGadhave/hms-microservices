package com.hms.admission.service;

import com.hms.admission.dto.AdmissionRequest;
import com.hms.admission.dto.AdmissionResponse;
import com.hms.admission.entity.Admission;
import com.hms.admission.repository.AdmissionRepository;
import com.hms.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdmissionService {

    private final AdmissionRepository admissionRepository;

    @Transactional
    public AdmissionResponse createAdmission(AdmissionRequest request) {
        Admission admission = Admission.builder()
                .patientId(request.getPatientId())
                .bedId(request.getBedId())
                .admissionDate(LocalDateTime.now())
                .status("ADMITTED")
                .build();
        admission = admissionRepository.save(admission);
        return mapToResponse(admission);
    }

    public List<AdmissionResponse> getPatientAdmissions(String patientId) {
        return admissionRepository.findByPatientId(patientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AdmissionResponse mapToResponse(Admission admission) {
        return AdmissionResponse.builder()
                .id(admission.getId())
                .patientId(admission.getPatientId())
                .bedId(admission.getBedId())
                .admissionDate(admission.getAdmissionDate())
                .dischargeDate(admission.getDischargeDate())
                .status(admission.getStatus())
                .build();
    }
}