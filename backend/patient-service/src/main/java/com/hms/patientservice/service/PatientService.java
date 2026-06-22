package com.hms.patientservice.service;

import com.hms.common.dto.AuditEvent;
import com.hms.common.exception.BusinessException;
import com.hms.patientservice.dto.PatientRequest;
import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.event.AuditEventProducer;
import com.hms.patientservice.event.PatientCreatedEvent;
import com.hms.patientservice.event.PatientEventProducer;
import com.hms.patientservice.mapper.PatientMapper;
import com.hms.patientservice.repository.PatientRepository;
import com.hms.common.util.CorrelationIdUtil;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientEventProducer producer;
    private final AuditEventProducer auditEventProducer;
    private final PatientMapper mapper;

    // [HIGH-14] Added @Transactional: if Kafka publish fails after DB save, the transaction rolls back.
    @Transactional
    public PatientResponse createPatient(PatientRequest patientRequest) {
        if (patientRepository.existsByEmailAndActiveTrue(patientRequest.getEmail())) {
            throw new BusinessException("Patient email already exists");
        }

        Patient patient =
                mapper.toEntity(patientRequest);

        patient.setActive(true);

        Patient savedPatient = patientRepository.save(patient);

        producer.publishPatientCreated(
                PatientCreatedEvent.builder()
                        .patientId(savedPatient.getId())
                        .email(savedPatient.getEmail())
                        .fullName(savedPatient.getFirstName() + " " + savedPatient.getLastName())
                        .build()
        );

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("patient-service")
                        .entityId(savedPatient.getId())
                        .action("CREATE")
                        .performedBy(savedPatient.getEmail())
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Patient record created")
                        .build()
        );

        return mapper
                .toResponse(savedPatient);
    }

    public Page<PatientResponse> getPatients(
            int page,
            int size,
            String search) {

        Pageable  pageable =
                PageRequest.of(page, size);

        return (search == null || search.isBlank()
                ? patientRepository.findByFirstNameContainingIgnoreCaseAndActiveTrue("", pageable)
                : patientRepository.searchPatients(search, pageable))
                .map(mapper::toResponse);
    }

    @Cacheable(value = "patients", key = "#id")
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String id) {
        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new BusinessException("Patient Not Found"));

        return mapper.toResponse(patient);
    }

    @CacheEvict(value = "patients", key = "#id")
    @Transactional  // [HIGH-14] Added @Transactional: ensures DB and audit event are atomic.
    public void softDeletePatient(String id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new BusinessException("Patient not found"));

        patient.setActive(false);
        patientRepository.save(patient);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("patient-service")
                        .entityId(patient.getId())
                        .action("DELETE")
                        .performedBy(patient.getEmail())
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Patient record deactivated")
                        .build()
        );
    }

}

