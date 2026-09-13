package com.strife.common.event.channel;

import java.util.List;
import java.util.UUID;

public record ChannelUpsertedEvent(UUID channelId, List<UUID> memberIds) {

}
