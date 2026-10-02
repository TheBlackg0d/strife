package com.strife.common.event.guild;

import java.util.UUID;
import java.util.List;
import com.strife.common.dto.UserDTO;

public record ChannelCreatedEvent(UUID channelId, String channelName, UUID guildId, List<UserDTO> members) {

}
