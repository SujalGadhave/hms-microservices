CREATE TABLE doctor_availability
(

    id VARCHAR(255) PRIMARY KEY,

    doctor_id VARCHAR(255) NOT NULL,

    day_of_week VARCHAR(50)  NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    slot_duration_minutes INTEGER NOT NULL,

    active BOOLEAN NOT NULL
);