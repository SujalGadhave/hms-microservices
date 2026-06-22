package com.hms.notification.scheduler;

import com.hms.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationRetryScheduler {

    private final EmailService emailService;

    @Scheduled(cron = "${notification.retry.cron:0 */10 * * * *}")
    public void retryFailedNotifications() {
        int retried = emailService.retryFailedNotifications();
        if (retried > 0) {
            log.info("Retried {} failed notification(s)", retried);
        }
    }
}
