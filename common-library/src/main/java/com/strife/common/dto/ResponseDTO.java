package com.strife.common.dto;

/**
 * Réponse générique succès/statut, commune à tous les services HTTP.
 */
public record ResponseDTO(String statusCode, String statusMessage) {

}
