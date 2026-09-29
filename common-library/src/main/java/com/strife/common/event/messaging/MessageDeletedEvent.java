package com.strife.common.event.messaging;

import java.util.List;
import java.util.UUID;

public record MessageDeletedEvent(List<UUID> fileId) {
}
