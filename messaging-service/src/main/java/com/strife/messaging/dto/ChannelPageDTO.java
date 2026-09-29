package com.strife.messaging.dto;

import java.util.List;

public record ChannelPageDTO(ChannelDTO channel, List<MessageDTO> messages, UserDTO currentUser,
                List<UserDTO> participants, boolean isGroupChannel, List<UserDTO> friends) {

}
