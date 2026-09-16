package com.strife.messaging.dto;

import java.util.UUID;

public record MediaRequest(UUID fileId, String contentType, String originalName) {

}
