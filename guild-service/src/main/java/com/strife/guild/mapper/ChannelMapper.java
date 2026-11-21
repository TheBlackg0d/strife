package com.strife.guild.mapper;

import com.strife.guild.model.Channel;
import com.strife.guild.dto.ChannelDTO;

public class ChannelMapper {
    

    public static Channel toEntity(ChannelDTO request) {
        Channel channel = new Channel();
        channel.setName(request.name());

        return channel;
    }
}
