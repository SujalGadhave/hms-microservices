package com.hms.audit.controller;

import com.hms.audit.entity.AuditLog;
import com.hms.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audits")
@RequiredArgsConstructor
public class AuditController {

    public final AuditService auditService;

    @GetMapping
    public Page<AuditLog> getAudits(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return auditService.getAudits(page, size);
    }

}