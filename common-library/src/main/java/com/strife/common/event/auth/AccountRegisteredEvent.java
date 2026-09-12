package com.strife.common.event.auth;

import java.util.UUID;

public record AccountRegisteredEvent(
                UUID userId,
                String username,
                String email,
                Long version) {

}
