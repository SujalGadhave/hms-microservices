package com.hms.auth.seeder;

import com.hms.auth.entity.Role;
import com.hms.auth.entity.User;
import com.hms.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedSuperAdmin();
        seedAdmin();
        seedDoctor();
        seedNurse();
        seedStaff();
    }

    private void seedSuperAdmin() {
        if (!userRepository.existsByEmail("superadmin@hms.com")) {
            User user = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email("superadmin@hms.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_SUPERADMIN)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded Super Admin user: superadmin@hms.com");
        }
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@hms.com")) {
            User user = User.builder()
                    .firstName("System")
                    .lastName("Admin")
                    .email("admin@hms.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded Admin user: admin@hms.com");
        }
    }

    private void seedDoctor() {
        if (!userRepository.existsByEmail("doctor@hms.com")) {
            User user = User.builder()
                    .firstName("Jane")
                    .lastName("Doe")
                    .email("doctor@hms.com")
                    .password(passwordEncoder.encode("Doctor@123"))
                    .role(Role.ROLE_DOCTOR)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded Doctor user: doctor@hms.com");
        }
    }

    private void seedNurse() {
        if (!userRepository.existsByEmail("nurse@hms.com")) {
            User user = User.builder()
                    .firstName("John")
                    .lastName("Smith")
                    .email("nurse@hms.com")
                    .password(passwordEncoder.encode("Nurse@123"))
                    .role(Role.ROLE_NURSE)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded Nurse user: nurse@hms.com");
        }
    }

    private void seedStaff() {
        if (!userRepository.existsByEmail("staff@hms.com")) {
            User user = User.builder()
                    .firstName("Support")
                    .lastName("Staff")
                    .email("staff@hms.com")
                    .password(passwordEncoder.encode("Staff@123"))
                    .role(Role.ROLE_STAFF)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
            log.info("Seeded Staff user: staff@hms.com");
        }
    }
}
