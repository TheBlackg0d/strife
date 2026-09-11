package com.strife.messaging.dto;

import java.util.UUID;

public record MessageRequest(UUID channelId, String content, String media) {

}
