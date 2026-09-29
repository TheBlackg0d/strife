package com.strife.messaging.dto;

import java.util.UUID;

import com.strife.messaging.model.Channel;
import com.strife.messaging.model.ChannelType;
import com.strife.messaging.model.User;

public record ChannelDTO(UUID id, String channelTitle, UUID ownerId, UUID guildId, ChannelType type, int memberCount) {

    public static ChannelDTO from(Channel channel, UUID currentUserId) {
        return new ChannelDTO(
                channel.getId(),
                getChannelTitle(channel, currentUserId),
                currentUserId,
                channel.getGuildId(),
                channel.getType(),
                channel.getMembers().size());
    }

    private static String getChannelTitle(Channel channel, UUID currentUserId) {
        if (channel.getType().equals(ChannelType.GROUP_DM)) {
            return channel.getName() != null ? channel.getName() : "Groupe Privé";
        }

        return channel.getMembers().stream().filter(user -> !user.getId().equals(currentUserId))
                .map(User::getUsername)
                .findFirst()
                .orElse("Utilisateur");
    }

}
