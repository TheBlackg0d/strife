package com.strife.auth.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponseDTO(
        String apiPath,
        int status,
        String message,
        Map<String, String> fieldErrors,
        LocalDateTime timestamp) {

}
