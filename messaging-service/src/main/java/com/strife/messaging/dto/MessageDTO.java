package com.strife.messaging.dto;

import java.time.Instant;
import java.util.UUID;

import com.strife.messaging.model.Message;

public record MessageDTO(UUID id, String content, MemberDTO sender, Instant timestamp) {

    public static MessageDTO from(Message message) {
        return new MessageDTO(message.getId(), message.getContent(), MemberDTO.from(message.getSender()),
                message.getTimestamp());
    }

}
