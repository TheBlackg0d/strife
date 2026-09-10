package com.strife.messaging.dto;

import java.time.Instant;
import java.util.UUID;

import com.strife.messaging.model.Message;

public record MessageDTO(UUID id, UUID channelId, String content, String media, UserDTO sender, Instant timestamp,
        Instant editedAt) {

    public static MessageDTO from(Message message) {
        return new MessageDTO(
                message.getId(),
                message.getChannel().getId(),
                message.getContent(),
                message.getMedia(),
                UserDTO.from(message.getSender()),
                message.getTimestamp(),
                message.getEditedAt());
    }
}
