package com.strife.common.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Corps de réponse d'erreur commun à tous les services HTTP.
 */
public record ErrorResponseDTO(
        String apiPath,
        int status,
        String message,
        Map<String, String> fieldErrors,
        LocalDateTime timestamp) {

}
