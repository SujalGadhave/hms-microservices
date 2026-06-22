package com.hms.notification;

import com.hms.notification.entity.NotificationLog;
import com.hms.notification.repository.NotificationRepository;
import com.hms.notification.service.EmailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class NotificationServiceApplicationTests {

    @Mock
    private JavaMailSender javaMailSender;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private EmailService emailService;

    @Test
    void sendMailPersistsNotificationLog() {
        emailService.sendMail("patient@example.com", "Subject", "Body");

        verify(javaMailSender).send(any(org.springframework.mail.SimpleMailMessage.class));
        verify(notificationRepository).save(any(NotificationLog.class));
    }

}
