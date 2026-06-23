package com.hms.appointment.service;

import com.hms.appointment.client.PatientClient;
import com.hms.common.dto.AuditEvent;
import com.hms.appointment.dto.AppointmentResponse;
import com.hms.appointment.dto.CreateAppointmentRequest;
import com.hms.appointment.dto.PatientResponse;
import com.hms.appointment.entity.Appointment;
import com.hms.appointment.entity.AppointmentStatus;
import com.hms.appointment.event.AuditEventProducer;
import com.hms.appointment.event.AppointmentCreatedEvent;
import com.hms.appointment.event.AppointmentEventProducer;
import com.hms.common.exception.BusinessException;
import com.hms.appointment.mapper.AppointmentMapper;
import com.hms.appointment.repository.AppointmentRepository;
import com.hms.common.util.CorrelationIdUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final PatientClient patientClient;
    private final AppointmentEventProducer appointmentEventProducer;
    private final AuditEventProducer auditEventProducer;

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        validateAppointmentTime(
                request.getAppointmentTime()
        );

        PatientResponse patient = validatePatient(
                request.getPatientId()
        );

        validateDoctorSlot(
                request.getDoctorId(),
                request.getAppointmentTime()
        );

        Appointment appointment = appointmentMapper.toEntity(request);

        appointment.setStatus(AppointmentStatus.SCHEDULED);

        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        appointmentEventProducer.publishAppointmentCreated(
                AppointmentCreatedEvent.builder()
                        .appointmentId(savedAppointment.getId())
                        .patientId(savedAppointment.getPatientId())
                        .doctorId(savedAppointment.getDoctorId())
                        .patientEmail(patient.getEmail())
                        .build()
        );

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("appointment-service")
                        .entityId(savedAppointment.getId())
                        .action("APPOINTMENT_BOOKED")
                        .performedBy(savedAppointment.getPatientId())
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Appointment booked for doctor " + savedAppointment.getDoctorId())
                        .build()
        );

        return appointmentMapper.toResponse(savedAppointment);
    }

    private void validateAppointmentTime(LocalDateTime appointmentTime) {
        if (appointmentTime.isBefore(LocalDateTime.now())) {
            throw new BusinessException("Appointment time cannot be in past");
        }
    }

    private PatientResponse validatePatient(String patientId) {
        try {
            PatientResponse patient = patientClient.getByPatientId(patientId);
            if (patient == null) {
                throw new BusinessException("Patient not found");
            }
            return patient;
        } catch (feign.FeignException.NotFound ex) {
            throw new BusinessException("Patient not found");
        } catch (Exception ex) {
            throw new BusinessException("Patient validation failed: " + ex.getMessage());
        }
    }

    private void validateDoctorSlot(String doctorId, LocalDateTime appointmentTime) {
        appointmentRepository.findByDoctorIdAndAppointmentTimeAndStatusNot(
                doctorId,
                appointmentTime,
                AppointmentStatus.CANCELED
        ).ifPresent(appointment -> {
            throw new BusinessException("Doctor slot already booked");
        });
    }

    @Cacheable(value = "appointments", key = "#id")
    public AppointmentResponse getAppointment(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        return appointmentMapper.toResponse(appointment);
    }

    @CacheEvict(value = "appointments", key = "#id") // [HIGH-19] Evict stale cache on cancel
    @Transactional
    public AppointmentResponse cancelAppointment(String id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        if (appointment.getStatus() == AppointmentStatus.CANCELED) {
            throw new BusinessException("Appointment canceled");
        }

        appointment.setStatus(AppointmentStatus.CANCELED);
        Appointment updated = appointmentRepository.save(appointment);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("appointment-service")
                        .entityId(updated.getId())
                        .action("APPOINTMENT_CANCELLED")
                        .performedBy(updated.getPatientId())
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Appointment cancelled")
                        .build()
        );

        return appointmentMapper.toResponse(updated);
    }

    @CacheEvict(value = "appointments", key = "#id") // [HIGH-19] Evict stale cache on reschedule
    @Transactional
    public AppointmentResponse rescheduleAppointment(String id, LocalDateTime newTime) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        validateAppointmentTime(newTime);
        validateDoctorSlot(appointment.getDoctorId(), newTime);

        appointment.setAppointmentTime(newTime);

        Appointment updated = appointmentRepository.save(appointment);

        auditEventProducer.publish(
                AuditEvent.builder()
                        .serviceName("appointment-service")
                        .entityId(updated.getId())
                        .action("UPDATE")
                        .performedBy(updated.getPatientId())
                        .correlationId(CorrelationIdUtil.currentOrGenerate())
                        .details("Appointment rescheduled to " + newTime)
                        .build()
        );

        return appointmentMapper.toResponse(updated);
    }

    public Page<AppointmentResponse> getAppointments(
            String id,
            AppointmentStatus status,
            int page,
            int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return appointmentRepository.findByDoctorIdAndStatus(id, status, pageable)
                .map(appointmentMapper::toResponse);
    }


}

