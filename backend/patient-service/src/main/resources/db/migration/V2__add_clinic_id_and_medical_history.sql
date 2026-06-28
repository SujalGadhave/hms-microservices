ALTER TABLE patients ADD COLUMN clinic_id VARCHAR(255) DEFAULT 'DEFAULT_CLINIC' NOT NULL;
ALTER TABLE patients ALTER COLUMN clinic_id DROP DEFAULT;

CREATE TABLE patient_allergies (
    patient_id VARCHAR(255) NOT NULL,
    allergy VARCHAR(255) NOT NULL,
    CONSTRAINT fk_patient_allergies_patient FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
);

CREATE TABLE medical_histories (
    id VARCHAR(255) PRIMARY KEY,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE NOT NULL,
    notes TEXT,
    patient_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_medical_history_patient FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
);
