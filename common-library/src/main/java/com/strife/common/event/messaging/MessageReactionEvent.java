package com.strife.common.event.messaging;

import java.util.UUID;

public record MessageReactionEvent(UUID messageId, UUID userId, UUID channelId, String emoji) {

}
