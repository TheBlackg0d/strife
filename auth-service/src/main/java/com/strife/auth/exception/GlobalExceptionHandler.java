package com.strife.auth.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.strife.auth.dto.ErrorResponseDTO;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(RessourceAlreadyExistException.class)
    public ResponseEntity<ErrorResponseDTO> handleRessourceAlreadyExistException(
            RessourceAlreadyExistException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception.getMessage(),
                fieldError(exception.getFieldName(), exception.getMessage()), webRequest);
    }

    @ExceptionHandler(RessourceDoNotMatchException.class)
    public ResponseEntity<ErrorResponseDTO> handleRessourceDoNotMatchException(
            RessourceDoNotMatchException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.BAD_REQUEST, exception.getMessage(),
                fieldError(exception.getFieldName(), exception.getMessage()), webRequest);
    }

    @ExceptionHandler(RessourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleRessourceNotFoundException(
            RessourceNotFoundException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.NOT_FOUND, exception.getMessage(), Map.of(), webRequest);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentialsException(
            BadCredentialsException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid email or password", Map.of(), webRequest);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponseDTO> handleAuthenticationException(
            AuthenticationException exception, WebRequest webRequest) {
        return buildResponse(HttpStatus.UNAUTHORIZED, exception.getMessage(), Map.of(), webRequest);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> validationErrors = new HashMap<>();
        List<ObjectError> validationErrorList = ex.getBindingResult().getAllErrors();
        validationErrorList.forEach((error) -> {
            if (error instanceof FieldError fieldError) {
                validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
        });

        ErrorResponseDTO body = new ErrorResponseDTO(
                request.getDescription(false),
                HttpStatus.BAD_REQUEST.value(),
                "Please fix the errors below",
                validationErrors,
                LocalDateTime.now());

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<ErrorResponseDTO> buildResponse(HttpStatus status, String message,
            Map<String, String> fieldErrors, WebRequest webRequest) {
        ErrorResponseDTO body = new ErrorResponseDTO(
                webRequest.getDescription(false),
                status.value(),
                message,
                fieldErrors,
                LocalDateTime.now());

        return new ResponseEntity<>(body, status);
    }

    private Map<String, String> fieldError(String fieldName, String message) {
        if (fieldName == null || fieldName.isBlank() || message == null) {
            return Map.of();
        }
        return Map.of(fieldName, message);
    }
}
