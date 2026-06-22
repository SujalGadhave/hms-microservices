package com.hms.billing.repository;

import com.hms.billing.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository
        extends JpaRepository<Invoice, String> {

    Optional<Invoice> findByAppointmentId(String appointmentId);

    Page<Invoice> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
