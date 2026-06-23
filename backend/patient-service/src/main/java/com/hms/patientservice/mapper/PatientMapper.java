package com.hms.patientservice.mapper;

import com.hms.patientservice.dto.PatientRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring")
public interface PatientMapper {

    /**
     * id is DB-generated (UUID); active is set explicitly by the service layer.
     * Both are intentionally excluded from the incoming request DTO mapping.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    Patient toEntity(PatientRequest patientRequest);

    PatientResponse toResponse(Patient patient);
}
