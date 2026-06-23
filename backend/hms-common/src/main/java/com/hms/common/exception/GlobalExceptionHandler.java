package com.hms.common.exception;

import org.slf4j.MDC;
import com.hms.common.dto.ApiResponse;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** 400 — domain-specific business rule violation */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        logger.warn("BusinessException [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 400 — @Valid / @Validated bean validation failure on @RequestBody */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining("; "));
        logger.warn("Validation failure [correlationId={}]: {}", MDC.get("X-Correlation-Id"), message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("Validation failed: " + message)
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 400 — @Validated constraint violation on path/query params */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
                .map(ConstraintViolation::getMessage)
                .collect(Collectors.joining("; "));
        logger.warn("Constraint violation [correlationId={}]: {}", MDC.get("X-Correlation-Id"), message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("Constraint violation: " + message)
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 404 — JPA entity not found */
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleEntityNotFound(EntityNotFoundException ex) {
        logger.warn("Entity not found [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message(ex.getMessage() != null ? ex.getMessage() : "Resource not found")
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 404 — Spring MVC static resource not found */
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNoResource(NoResourceFoundException ex) {
        logger.warn("No resource found [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("Endpoint not found")
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 403 — Spring Security access denied */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
        logger.warn("Access denied [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("Access denied: insufficient permissions")
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 409 — DB unique constraint / foreign key violation */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrity(DataIntegrityViolationException ex) {
        logger.warn("Data integrity violation [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMostSpecificCause().getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("Resource already exists or constraint violated")
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 500 — catch-all for unexpected exceptions (no stack trace leaked to client) */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        logger.error("Unhandled exception [correlationId={}]: ", MDC.get("X-Correlation-Id"), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message("An unexpected error occurred.")
                        .timeStamp(LocalDateTime.now())
                        .build());
    }

    /** 401 — Authentication failure */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthFailure(AuthenticationException ex) {
        logger.warn("Authentication failure [correlationId={}]: {}", MDC.get("X-Correlation-Id"), ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.<Void>builder()
                        .success(false)
                        .message(ex.getMessage())
                        .timeStamp(LocalDateTime.now())
                        .build());
    }
}
