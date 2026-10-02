package com.strife.guild.dto;

import java.util.UUID;
import com.strife.guild.model.Channel;

public record ChannelDTO(UUID id, String name) {

    public static ChannelDTO of(Channel channel) {
        return new ChannelDTO(channel.getId(), channel.getName());
    }

}
