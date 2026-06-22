package com.hms.notification.controller;

import com.hms.notification.entity.NotificationLog;
import com.hms.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final EmailService emailService;

    @GetMapping
    public ResponseEntity<Page<NotificationLog>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(emailService.getNotifications(page, size));
    }

    @PostMapping("/{id}/retry")
    public ResponseEntity<NotificationLog> retryNotification(@PathVariable String id) {
        return ResponseEntity.ok(emailService.retryFailedNotification(id));
    }
}
