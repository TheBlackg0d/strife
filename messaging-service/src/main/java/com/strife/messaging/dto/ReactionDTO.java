package com.strife.messaging.dto;

import java.util.UUID;

import com.strife.messaging.model.Reaction;

public record ReactionDTO(UUID id, UUID userId, UUID messageId, UUID channelId, String emoji) {

    public static ReactionDTO from(Reaction reaction) {
        return new ReactionDTO(
                reaction.getId(),
                reaction.getUser().getId(),
                reaction.getMessage().getId(),
                reaction.getMessage().getChannel().getId(),
                reaction.getEmoji());
    }
}
