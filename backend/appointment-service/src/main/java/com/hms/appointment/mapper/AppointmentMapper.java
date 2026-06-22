package com.hms.appointment.mapper;

import com.hms.appointment.dto.AppointmentResponse;
import com.hms.appointment.dto.CreateAppointmentRequest;
import com.hms.appointment.entity.Appointment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {

    Appointment toEntity(CreateAppointmentRequest appointmentRequest);

    AppointmentResponse toResponse(Appointment appointment);
}
