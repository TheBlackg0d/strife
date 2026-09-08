package com.strife.messaging.dto;

import java.util.Set;
import java.util.UUID;

public record PrivateChannelRequest(String channelName, Set<UUID> members) {

}
