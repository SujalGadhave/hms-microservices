CREATE TABLE invoices (

                          id VARCHAR(255) PRIMARY KEY,

                          patient_id VARCHAR(255) NOT NULL,

                          appointment_id VARCHAR(255) NOT NULL,

                          consultation_fee NUMERIC(10,2) NOT NULL,

                          tax NUMERIC(10,2) NOT NULL,

                          total_amount NUMERIC(10,2) NOT NULL,

                          status VARCHAR(50) NOT NULL,

                          created_at TIMESTAMP NOT NULL
);