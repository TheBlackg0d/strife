package com.strife.common.event;

import java.time.Instant;
import java.util.UUID;

public record MessagePostedEvent(UUID messageId, UUID channelId, UUID senderId, String senderUsername, String content,
        Instant sentAt) {

}
