package com.hms.notification.repository;

import com.hms.notification.entity.NotificationLog;
import com.hms.notification.entity.NotificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationLog, String> {

    Page<NotificationLog> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<NotificationLog> findTop20ByStatusOrderByCreatedAtAsc(NotificationStatus status);
}
