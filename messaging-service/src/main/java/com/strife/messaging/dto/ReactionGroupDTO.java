package com.strife.messaging.dto;

import java.util.List;

public record ReactionGroupDTO(String emoji, List<ReactionDTO> reactions, int count) {

    public static ReactionGroupDTO from(String emoji, List<ReactionDTO> reactions) {
        return new ReactionGroupDTO(emoji, reactions, reactions.size());
    }
}
