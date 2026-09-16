package com.strife.common.event.messaging;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MessageUpdatedEvent(UUID messageId, UUID channelId, UUID senderId, String senderUsername, String content,
                List<MediaAttachment> media,
                Instant sentAt,
                Instant editedAt) {

}
