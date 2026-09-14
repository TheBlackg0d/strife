package com.strife.users.event;

public enum EventRoutingKey {
    RELATIONSHIP_ADDED("user.relationship.added"),
    RELATIONSHIP_REMOVED("user.relationship.removed"),
    RELATIONSHIP_SENT("user.relationship.sent");

    private String value;

    private EventRoutingKey(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }
}
