package com.hms.appointment.controller.v1;

import com.hms.appointment.dto.AvailableSlotResponse;
import com.hms.appointment.dto.CreateAvailabilityRequest;
import com.hms.appointment.service.DoctorAvailabilityService;
import com.hms.appointment.service.SchedulingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/availability")
@RequiredArgsConstructor
public class DoctorAvailabilityControllerV1 {

    private final DoctorAvailabilityService doctorAvailabilityService;
    private final SchedulingService schedulingService;

    @PostMapping
    public ResponseEntity<Void> createAvailability(@Valid @RequestBody CreateAvailabilityRequest createAvailabilityRequest) {
        doctorAvailabilityService.createAvailability(createAvailabilityRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/slots")
    public List<AvailableSlotResponse> getSlots(
            @RequestParam String doctorId,
            @RequestParam String date
    ) {
        return schedulingService.generateSlots(
                doctorId,
                LocalDate.parse(date)
        );
    }

}
