package com.hms.patientservice;

import com.hms.patientservice.dto.PatientResponse;
import com.hms.patientservice.entity.Patient;
import com.hms.patientservice.event.AuditEventProducer;
import com.hms.patientservice.event.PatientEventProducer;
import com.hms.patientservice.mapper.PatientMapper;
import com.hms.patientservice.repository.PatientRepository;
import com.hms.patientservice.service.PatientService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientServiceApplicationTests {

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PatientEventProducer producer;

    @Mock
    private AuditEventProducer auditEventProducer;

    @Mock
    private PatientMapper mapper;

    @InjectMocks
    private PatientService patientService;

    @Test
    void getPatientByIdDoesNotDeactivatePatient() {
        Patient patient = Patient.builder()
                .id("patient-1")
                .active(true)
                .build();
        PatientResponse response = PatientResponse.builder().id("patient-1").build();

        when(patientRepository.findById("patient-1")).thenReturn(Optional.of(patient));
        when(mapper.toResponse(patient)).thenReturn(response);

        assertThat(patientService.getPatientById("patient-1").getId()).isEqualTo("patient-1");
        assertThat(patient.getActive()).isTrue();
    }

}
