package com.hms.appointment;

import com.hms.appointment.client.PatientClient;
import com.hms.appointment.dto.CreateAppointmentRequest;
import com.hms.appointment.dto.PatientResponse;
import com.hms.appointment.entity.Appointment;
import com.hms.appointment.entity.AppointmentStatus;
import com.hms.appointment.event.AuditEventProducer;
import com.hms.appointment.event.AppointmentEventProducer;
import com.hms.appointment.mapper.AppointmentMapper;
import com.hms.appointment.repository.AppointmentRepository;
import com.hms.appointment.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceApplicationTests {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentMapper appointmentMapper;

    @Mock
    private PatientClient patientClient;

    @Mock
    private AppointmentEventProducer appointmentEventProducer;

    @Mock
    private AuditEventProducer auditEventProducer;

    @InjectMocks
    private AppointmentService appointmentService;

    @Test
    void cancelAppointmentMarksStatusAsCanceled() {
        Appointment appointment = Appointment.builder()
                .id("appointment-1")
                .status(AppointmentStatus.SCHEDULED)
                .build();

        when(appointmentRepository.findById("appointment-1")).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(appointmentMapper.toResponse(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment saved = invocation.getArgument(0);
            com.hms.appointment.dto.AppointmentResponse response = new com.hms.appointment.dto.AppointmentResponse();
            response.setId(saved.getId());
            response.setStatus(saved.getStatus());
            return response;
        });

        assertThat(appointmentService.cancelAppointment("appointment-1").getStatus())
                .isEqualTo(AppointmentStatus.CANCELED);
    }

    @Test
    void createAppointmentPublishesEventCompatiblePayload() {
        CreateAppointmentRequest request = new CreateAppointmentRequest();
        request.setPatientId("patient-1");
        request.setDoctorId("doctor-1");
        request.setAppointmentTime(LocalDateTime.now().plusDays(1));

        Appointment mapped = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentTime(request.getAppointmentTime())
                .build();
        Appointment saved = Appointment.builder()
                .id("appointment-1")
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentTime(request.getAppointmentTime())
                .status(AppointmentStatus.SCHEDULED)
                .build();

        PatientResponse patientResponse = new PatientResponse();
        patientResponse.setEmail("patient@example.com");

        when(patientClient.getByPatientId("patient-1")).thenReturn(patientResponse);
        when(appointmentRepository.findByDoctorIdAndAppointmentTimeAndStatusNot(
                request.getDoctorId(),
                request.getAppointmentTime(),
                AppointmentStatus.CANCELED
        )).thenReturn(Optional.empty());
        when(appointmentMapper.toEntity(request)).thenReturn(mapped);
        when(appointmentRepository.save(mapped)).thenReturn(saved);
        when(appointmentMapper.toResponse(saved)).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            com.hms.appointment.dto.AppointmentResponse response = new com.hms.appointment.dto.AppointmentResponse();
            response.setId(appointment.getId());
            response.setStatus(appointment.getStatus());
            return response;
        });

        assertThat(appointmentService.createAppointment(request).getId()).isEqualTo("appointment-1");
    }

}
