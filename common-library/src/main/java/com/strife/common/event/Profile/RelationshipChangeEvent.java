package com.strife.common.event.Profile;

import java.util.UUID;

import com.strife.common.model.RelationshipStatus;

public record RelationshipChangeEvent(UUID userId, UUID friendId, RelationshipStatus type) {

}
