package com.hms.admission.repository;

import com.hms.admission.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, String> {
    List<Admission> findByPatientId(String patientId);
}