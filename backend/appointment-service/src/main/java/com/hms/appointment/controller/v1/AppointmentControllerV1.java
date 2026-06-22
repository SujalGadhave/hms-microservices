package com.hms.appointment.controller.v1;

import com.hms.appointment.dto.AppointmentResponse;
import com.hms.appointment.dto.CreateAppointmentRequest;
import com.hms.appointment.entity.AppointmentStatus;
import com.hms.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentControllerV1 {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest createAppointmentRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(createAppointmentRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable("id") String id) {
        return ResponseEntity.ok(appointmentService.getAppointment(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable String id,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
            java.time.LocalDateTime newTime
    ) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, newTime));
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentResponse>> getAllAppointments(
            @RequestParam String doctorId,
            @RequestParam AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(appointmentService.getAppointments(doctorId, status, page, size));
    }
}
