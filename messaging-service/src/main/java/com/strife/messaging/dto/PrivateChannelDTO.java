package com.strife.messaging.dto;

import java.util.List;
import java.util.UUID;

import com.strife.messaging.model.PrivateChannel;

public record PrivateChannelDTO(UUID id, String channelName, List<UserDTO> users) {

    public static PrivateChannelDTO from(PrivateChannel privateChannel) {
        return new PrivateChannelDTO(privateChannel.getId(), privateChannel.getChannelName(),
                privateChannel.getMembers().stream().map(UserDTO::from).toList());
    }

}
