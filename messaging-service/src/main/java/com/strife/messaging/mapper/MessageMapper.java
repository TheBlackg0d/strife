package com.strife.messaging.mapper;

import com.strife.common.event.messaging.MessageReactionEvent;
import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.messaging.dto.MessageDTO;

public class MessageMapper {

    public static MessageUpdatedEvent messageDtoToMessageUpdatedEvent(MessageDTO messageDto) {
        return new MessageUpdatedEvent(
                messageDto.id(),
                messageDto.channelId(),
                messageDto.sender().id(),
                messageDto.sender().username(),
                messageDto.content(),
                messageDto.media(),
                messageDto.timestamp(),
                messageDto.editedAt());
    }

}
