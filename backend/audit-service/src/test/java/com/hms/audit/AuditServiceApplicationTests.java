package com.hms.audit;

import com.hms.common.dto.AuditEvent;
import com.hms.audit.entity.AuditAction;
import com.hms.audit.entity.AuditLog;
import com.hms.audit.repository.AuditLogRepository;
import com.hms.audit.service.AuditService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AuditServiceApplicationTests {

    @Mock
    private AuditLogRepository repository;

    @InjectMocks
    private AuditService auditService;

    @Test
    void saveAuditPersistsMandatoryFields() {
        AuditEvent event = new AuditEvent();
        event.setAction(AuditAction.CREATE.name());
        event.setEntityId("patient-1");
        event.setServiceName("patient-service");

        auditService.saveAudit(event);

        verify(repository).save(any(AuditLog.class));
    }

}

