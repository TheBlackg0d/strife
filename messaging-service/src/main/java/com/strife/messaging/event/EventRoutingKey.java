package com.strife.messaging.event;

public enum EventRoutingKey {
    MESSAGE_POSTED("messaging.message.posted"),
    CHANNEL_UPSERTED("messaging.channel.upserted"),
    MESSAGE_UPDATED("messaging.message.updated"),
    MESSAGE_DELETED("messaging.message.deleted"),

    REACTION_CREATED("messaging.reaction.created"),
    REACTION_DELETED("messaging.reaction.deleted");

    private String value;

    private EventRoutingKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
