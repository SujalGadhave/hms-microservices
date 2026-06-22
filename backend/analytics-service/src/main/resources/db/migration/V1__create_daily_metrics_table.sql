CREATE TABLE daily_metrics (
    id VARCHAR(255) PRIMARY KEY,
    metric_date DATE NOT NULL UNIQUE,
    appointment_count BIGINT NOT NULL,
    cancelled_appointments BIGINT NOT NULL,
    completed_appointments BIGINT NOT NULL,
    patient_registrations BIGINT NOT NULL,
    total_revenue NUMERIC(12, 2) NOT NULL
);
