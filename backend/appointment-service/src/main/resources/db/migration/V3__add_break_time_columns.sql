ALTER TABLE doctor_availability
    ADD COLUMN break_start_time TIME NOT NULL DEFAULT '13:00:00';

ALTER TABLE doctor_availability
    ADD COLUMN break_end_time TIME NOT NULL DEFAULT '14:00:00';