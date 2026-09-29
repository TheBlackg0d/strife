package com.strife.users.model;

public enum FriendListFilter {
    PENDING_FRIEND_REQUEST_SENT("Envoyées"),
    PENDING_FRIEND_REQUEST_RECEIVED("En attente"),
    ONLINE("En ligne"),
    ALL("Tous"),
    BLOCKED("Bloqués");

    private String label;

    private FriendListFilter(String label) {
        this.label = label;
    }

    public String getLabel() {
        return this.label;
    }
}
