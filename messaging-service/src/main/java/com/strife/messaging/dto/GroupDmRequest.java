package com.strife.messaging.dto;

import java.util.Set;
import java.util.UUID;

public record GroupDmRequest(String name, Set<UUID> members) {

}
