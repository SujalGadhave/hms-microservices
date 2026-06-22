CREATE TABLE appointments (

    id VARCHAR(255) PRIMARY KEY,

    patient_id VARCHAR(255) NOT NULL,

    doctor_id VARCHAR(255) NOT NULL,

    appointment_time TIMESTAMP NOT NULL,

    status VARCHAR(50) NOT NULL,

    version BIGINT,

    created_at TIMESTAMP NOT NULL
);