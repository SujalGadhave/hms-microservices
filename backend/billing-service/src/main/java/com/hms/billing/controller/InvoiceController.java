package com.hms.billing.controller;

import com.hms.billing.dto.InvoiceResponse;
import com.hms.billing.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoice(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getInvoice(id));
    }

    @GetMapping
    public ResponseEntity<Page<InvoiceResponse>> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(invoiceService.getInvoices(page, size));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<InvoiceResponse> payInvoice(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }

}
