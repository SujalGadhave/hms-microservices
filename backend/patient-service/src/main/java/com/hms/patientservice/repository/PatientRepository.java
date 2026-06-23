package com.hms.patientservice.repository;

import com.hms.patientservice.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PatientRepository extends JpaRepository<Patient, String> {

    boolean existsByEmailAndActiveTrue(String email);

    Page<Patient> findAllByActiveTrue(Pageable pageable);

    Page<Patient> findByFirstNameContainingIgnoreCaseAndActiveTrue(
            String firstName,
            Pageable pageable);

    @Query("""
SELECT p FROM Patient p
WHERE
(
    LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%'))
    OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%'))
    OR LOWER(p.email) LIKE LOWER(CONCAT('%', :search, '%'))
    OR LOWER(p.phoneNumber) LIKE LOWER(CONCAT('%', :search, '%'))
)
AND p.active = true
""")
    Page<Patient> searchPatients(
            @Param("search") String search,
            Pageable pageable
    );
}
