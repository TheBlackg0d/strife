package com.strife.messaging.dto;

import java.util.List;
import java.util.UUID;


public record MessageRequest(UUID channelId, String content, List<UUID> media) {

}
