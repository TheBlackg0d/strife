package com.strife.messaging.event;

public enum EventRoutingKey {
    MESSAGE_POSTED("messaging.message.posted"),
    CHANNEL_UPSERTED("messaging.channel.upserted"),
    MESSAGE_UPDATED("messaging.message.updated");

    private String value;

    private EventRoutingKey(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
