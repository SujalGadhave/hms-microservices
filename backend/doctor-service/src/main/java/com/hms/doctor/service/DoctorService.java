package com.hms.doctor.service;

import com.hms.doctor.dto.DoctorRequest;
import com.hms.doctor.dto.DoctorResponse;
import com.hms.doctor.entity.Doctor;
import com.hms.doctor.repository.DoctorRepository;
import com.hms.common.exception.BusinessException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {
        if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessException("Doctor with email already exists");
        }
        
        Doctor doctor = Doctor.builder()
                .name(request.getName())
                .email(request.getEmail())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears())
                .qualifications(request.getQualifications())
                .active(true)
                .build();
                
        doctor = doctorRepository.save(doctor);
        return mapToResponse(doctor);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll(PageRequest.of(0, 1000)).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        return mapToResponse(doctor);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .specialization(doctor.getSpecialization())
                .experienceYears(doctor.getExperienceYears())
                .qualifications(doctor.getQualifications())
                .active(doctor.isActive())
                .createdAt(doctor.getCreatedAt())
                .build();
    }
}
