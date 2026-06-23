package com.hms.appointment.service;

import com.hms.appointment.dto.AvailableSlotResponse;
import com.hms.appointment.entity.DoctorAvailability;
import com.hms.appointment.repository.*;
import com.hms.common.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SchedulingService {

    private final DoctorAvailabilityRepository availabilityRepository;

    private final AppointmentRepository appointmentRepository;

    private final DoctorLeaveRepository leaveRepository;

    public List<AvailableSlotResponse> generateSlots(String doctorId, LocalDate date) {

        leaveRepository.findByDoctorIdAndLeaveDate(doctorId, date).ifPresent(leave -> {
            throw new BusinessException("Doctor unavailable due to leave");
        });

        List<DoctorAvailability> schedules = availabilityRepository
                .findByDoctorIdAndDayOfWeekAndActiveTrue(doctorId, date.getDayOfWeek());

        List<AvailableSlotResponse> slots = new ArrayList<>();

        for (DoctorAvailability schedule : schedules) {

            LocalTime current = schedule.getStartTime();
            LocalTime breakStart = schedule.getBreakStartTime();
            LocalTime breakEnd = schedule.getBreakEndTime();
            int duration = schedule.getSlotDurationMinutes();

            while (!current.plusMinutes(duration).isAfter(schedule.getEndTime())) {
                if (!current.isBefore(breakStart) && current.isBefore(breakEnd)) {
                    current = breakEnd;
                    continue;
                }

                LocalDateTime slotDateTime = LocalDateTime.of(date, current);

                boolean booked = appointmentRepository
                        .findByDoctorIdAndAppointmentTimeAndStatusNot(
                                doctorId,
                                slotDateTime,
                                com.hms.appointment.entity.AppointmentStatus.CANCELED
                        )
                        .isPresent();

                slots.add(AvailableSlotResponse.builder()
                        .slotTime(slotDateTime)
                        .booked(booked)
                        .build());

                current = current.plusMinutes(duration);
            }
        }

        return slots;
    }
}
