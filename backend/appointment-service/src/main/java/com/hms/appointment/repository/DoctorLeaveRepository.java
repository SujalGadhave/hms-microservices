package com.hms.appointment.repository;

import com.hms.appointment.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, String> {

    Optional<DoctorLeave> findByDoctorIdAndLeaveDate(String doctorId, LocalDate leaveDate);

}
