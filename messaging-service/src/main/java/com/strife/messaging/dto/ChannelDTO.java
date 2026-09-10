package com.strife.messaging.dto;

import java.util.List;
import java.util.UUID;

import com.strife.messaging.model.Channel;
import com.strife.messaging.model.ChannelType;

public record ChannelDTO(UUID id, ChannelType type, String name, UUID ownerId, UUID guildId, boolean showChannel,
        List<UserDTO> users) {

    public static ChannelDTO from(Channel channel) {
        return new ChannelDTO(
                channel.getId(),
                channel.getType(),
                channel.getName(),
                channel.getOwner() == null ? null : channel.getOwner().getId(),
                channel.getGuildId(),
                channel.isShowChannel(),
                channel.getMembers().stream().map(UserDTO::from).toList());
    }
}
