CREATE TABLE doctor_leave (

                              id VARCHAR(255) PRIMARY KEY,

                              doctor_id VARCHAR(255) NOT NULL,

                              leave_date DATE NOT NULL,

                              reason VARCHAR(255)
);