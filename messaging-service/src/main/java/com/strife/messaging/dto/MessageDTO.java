package com.strife.messaging.dto;

import java.time.Instant;
import java.util.UUID;

import com.strife.messaging.model.Message;

public record MessageDTO(UUID id, String content, UserDTO sender, Instant timestamp) {

    public static MessageDTO from(Message message) {
        return new MessageDTO(message.getId(), message.getContent(), UserDTO.from(message.getSender()),
                message.getTimestamp());
    }

}
