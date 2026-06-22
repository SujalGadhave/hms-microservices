CREATE TABLE audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    correlation_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    details TEXT
);
