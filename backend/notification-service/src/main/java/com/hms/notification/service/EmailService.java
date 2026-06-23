package com.hms.notification.service;

import com.hms.notification.entity.NotificationLog;
import com.hms.notification.entity.NotificationStatus;
import com.hms.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    private final NotificationRepository notificationRepository;

    @Async
    public void sendMail(String recipient, String subject, String body) {
        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException("Recipient email is required");
        }

        NotificationLog log = NotificationLog.builder()
                .recipient(recipient)
                .subject(subject)
                .body(body)
                .createdAt(LocalDateTime.now())
                .status(NotificationStatus.PENDING)
                .build();

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            message.setTo(recipient);
            message.setSubject(subject);
            message.setText(body);

            javaMailSender.send(message);

            log.setStatus(NotificationStatus.SENT);
        } catch (Exception e) {
            log.setStatus(NotificationStatus.FAILED);
        }

        notificationRepository.save(log);
    }

    public Page<NotificationLog> getNotifications(int page, int size) {
        return notificationRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
    }

    public NotificationLog retryFailedNotification(String id) {
        NotificationLog log = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (log.getStatus() != NotificationStatus.FAILED) {
            return log;
        }

        sendStoredMessage(log);
        return notificationRepository.findById(id).orElse(log);
    }

    public int retryFailedNotifications() {
        List<NotificationLog> failedLogs = notificationRepository
                .findTop20ByStatusOrderByCreatedAtAsc(NotificationStatus.FAILED);

        failedLogs.forEach(this::sendStoredMessage);
        return failedLogs.size();
    }

    private void sendStoredMessage(NotificationLog log) {
        if (log.getRetryCount() != null && log.getRetryCount() >= 3) {
            log.setStatus(NotificationStatus.FAILED);
            // In a real system, you might set it to DEAD_LETTER here.
            notificationRepository.save(log);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(log.getRecipient());
            message.setSubject(log.getSubject());
            message.setText(log.getBody());
            javaMailSender.send(message);
            log.setStatus(NotificationStatus.SENT);
        } catch (Exception ex) {
            log.setStatus(NotificationStatus.FAILED);
            log.setRetryCount((log.getRetryCount() == null ? 0 : log.getRetryCount()) + 1);
        }
        notificationRepository.save(log);
    }
}
