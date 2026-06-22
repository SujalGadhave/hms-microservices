package com.hms.laboratory.repository;

import com.hms.laboratory.entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, String> {
    List<LabTest> findByPatientId(String patientId);
}