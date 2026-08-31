package com.strife.common.exception;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import com.strife.common.dto.ErrorResponseDTO;

/**
 * Traduit les exceptions Spring Security en {@link ErrorResponseDTO}.
 *
 * <p>
 * Séparé de {@link GlobalExceptionHandler} pour n'être chargé que dans les
 * services qui ont spring-security-core sur leur classpath.
 */
@ControllerAdvice
public class SecurityExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(
            BadCredentialsException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password", webRequest);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthenticationException(
            AuthenticationException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), webRequest);
    }

    private ResponseEntity<ErrorResponseDTO> buildResponse(HttpStatus status, String message, WebRequest webRequest) {
        ErrorResponseDTO body = new ErrorResponseDTO(
                webRequest.getDescription(false),
                status.value(),
                message,
                Map.of(),
                LocalDateTime.now());

        return new ResponseEntity<>(body, status);
    }
}
