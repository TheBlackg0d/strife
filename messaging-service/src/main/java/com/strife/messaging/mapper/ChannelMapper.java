package com.strife.messaging.mapper;

import java.util.List;

import com.strife.common.file.FileUrlSigner;
import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.ChannelPageDTO;
import com.strife.messaging.dto.ChannelDTO;
import com.strife.messaging.dto.MessageDTO;
import com.strife.messaging.dto.UserDTO;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.ChannelType;

public class ChannelMapper {

    public static ChannelPageDTO toChannelPageDTO(Channel channel, FileUrlSigner fileUrlSigner,
            JwtPrincipal principal, List<UserDTO> friends) {
        ChannelDTO channelDTO = ChannelDTO.from(channel, principal.id());
        List<MessageDTO> messageDTOs = channel.getMessages().stream()
                .map(it -> MessageDTO.from(it, fileUrlSigner))
                .toList();

        List<UserDTO> memberDTOs = channel.getMembers().stream()
                .map(UserDTO::from)
                .toList();

        boolean isGroupChannel = channel.getType().equals(ChannelType.GROUP_DM);

        return new ChannelPageDTO(channelDTO, messageDTOs, UserDTO.from(principal), memberDTOs, isGroupChannel,
                friends);
    }

    public static ChannelDTO toChannelDTO(Channel channel, JwtPrincipal principal) {
        return ChannelDTO.from(channel, principal.id());
    }
}
