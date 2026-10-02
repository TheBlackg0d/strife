package com.strife.guild.event;

public enum EventRoutingKey {
    GUILD_CREATED("guild.guild.created"),
    GUILD_UPDATED("guild.guild.updated"),
    GUILD_DELETED("guild.guild.deleted"),
    CHANNEL_CREATED("guild.channel.created");

    private final String routingKey;

    EventRoutingKey(String routingKey) {
        this.routingKey = routingKey;
    }

    public String getRoutingKey() {
        return routingKey;
    }
}
