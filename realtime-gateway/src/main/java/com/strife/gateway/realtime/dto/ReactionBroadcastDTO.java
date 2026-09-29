package com.strife.gateway.realtime.dto;

import com.strife.common.event.messaging.MessageReactionEvent;
import com.strife.gateway.realtime.event.ReactionEventActionType;

public record ReactionBroadcastDTO(ReactionEventActionType actionType, MessageReactionEvent reactionEvent) {

}
