package com.strife.gateway.realtime.dto;

import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.gateway.realtime.event.MessageEventActionType;

public record MessageBroadcastDTO(MessageEventActionType actionType, MessageUpdatedEvent message) {
}
