package com.hms.appointment.repository;

import com.hms.appointment.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, String> {

    List<DoctorAvailability> findByDoctorIdAndDayOfWeekAndActiveTrue(String doctorId, DayOfWeek dayOfWeek);

}
