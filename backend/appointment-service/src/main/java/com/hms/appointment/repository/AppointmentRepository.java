package com.hms.appointment.repository;

import com.hms.appointment.entity.Appointment;
import com.hms.appointment.entity.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    Optional<Appointment> findByDoctorIdAndAppointmentTimeAndStatusNot(
            String doctorId,
            LocalDateTime appointmentTime,
            AppointmentStatus excludedStatus
    );

    Page<Appointment> findByDoctorIdAndStatus(String doctorId,
                                              AppointmentStatus status,
                                              Pageable pageable);
}
