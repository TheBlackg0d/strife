package com.strife.messaging.dto;

import java.util.UUID;

public record ReactionRequest(UUID channelId, UUID messageId, UUID userId, String emoji) {

}
