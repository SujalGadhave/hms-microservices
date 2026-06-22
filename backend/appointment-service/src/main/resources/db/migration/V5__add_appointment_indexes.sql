CREATE UNIQUE INDEX IF NOT EXISTS ux_appointments_doctor_time
    ON appointments (doctor_id, appointment_time)
    WHERE status <> 'CANCELED';

CREATE UNIQUE INDEX IF NOT EXISTS ux_doctor_availability_doctor_day
    ON doctor_availability (doctor_id, day_of_week);

CREATE UNIQUE INDEX IF NOT EXISTS ux_doctor_leave_doctor_date
    ON doctor_leave (doctor_id, leave_date);
