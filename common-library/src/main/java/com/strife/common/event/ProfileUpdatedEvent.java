package com.strife.common.event;

import java.util.UUID;

public record ProfileUpdatedEvent(UUID userId, String username, String email) {

}
