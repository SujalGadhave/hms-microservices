package com.hms.appointment.service;

import com.hms.appointment.dto.CreateAvailabilityRequest;
import com.hms.appointment.entity.DoctorAvailability;
import com.hms.common.exception.BusinessException;
import com.hms.appointment.repository.DoctorAvailabilityRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Transactional
    public void createAvailability(CreateAvailabilityRequest createAvailabilityRequest) {
        if (createAvailabilityRequest.getStartTime().isAfter(createAvailabilityRequest.getEndTime())) {
            throw new BusinessException("Start time must be before end time");
        }
        if (createAvailabilityRequest.getBreakStartTime().isAfter(createAvailabilityRequest.getBreakEndTime())) {
            throw new BusinessException("Break start time must be before break end time");
        }

        DoctorAvailability doctorAvailability = DoctorAvailability.builder()
                .doctorId(createAvailabilityRequest.getDoctorId())
                .dayOfWeek(createAvailabilityRequest.getDayOfWeek())
                .startTime(createAvailabilityRequest.getStartTime())
                .endTime(createAvailabilityRequest.getEndTime())
                .breakStartTime(createAvailabilityRequest.getBreakStartTime())
                .breakEndTime(createAvailabilityRequest.getBreakEndTime())
                .slotDurationMinutes(createAvailabilityRequest.getSlotDurationMinutes())
                .active(true)
                .build();

        doctorAvailabilityRepository.save(doctorAvailability);
    }

}

