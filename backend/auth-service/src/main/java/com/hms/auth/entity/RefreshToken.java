package com.hms.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    @Column(name = "user_email", nullable = false)
    private String email;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiredAt;

}
