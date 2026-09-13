package com.strife.common.event.messaging;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record MessagePostedEvent(UUID messageId, UUID channelId, UUID senderId, String senderUsername, String content,
        List<String> media,
        Instant sentAt) {

}
