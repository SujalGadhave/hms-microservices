CREATE UNIQUE INDEX IF NOT EXISTS ux_invoices_appointment_id
    ON invoices (appointment_id);
