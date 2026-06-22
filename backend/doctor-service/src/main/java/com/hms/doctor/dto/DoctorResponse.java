package com.hms.doctor.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DoctorResponse {
    private String id;
    private String name;
    private String email;
    private String specialization;
    private int experienceYears;
    private String qualifications;
    private boolean active;
    private LocalDateTime createdAt;
}
