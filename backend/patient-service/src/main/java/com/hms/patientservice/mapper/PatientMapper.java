package com.hms.patientservice.mapper;

import com.hms.patientservice.dto.PatientRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Patient;
import org.mapstruct.Mapper;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    Patient toEntity(PatientRequest patientRequest);

    PatientResponse toResponse(Patient patient);
}
