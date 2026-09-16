package com.strife.common.event.messaging;

import java.util.UUID;

public record MediaAttachment(UUID fileId, String url, String contentType, String originalName) {

}
