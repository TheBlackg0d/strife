package com.strife.gateway.realtime.dto;

import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.gateway.realtime.event.EventActionType;

public record MessageBroadcastDTO(EventActionType actionType, MessageUpdatedEvent message) {

    public static MessageBroadcastDTO created(MessageUpdatedEvent message) {
        return new MessageBroadcastDTO(EventActionType.CREATED, message);
    }

    public static MessageBroadcastDTO updated(MessageUpdatedEvent message) {
        return new MessageBroadcastDTO(EventActionType.UPDATED, message);
    }

}
