package com.strife.common.event.file;

import java.util.UUID;

import com.strife.common.model.FileScope;

public record FileCreatedEvent(FileScope scope, String objectKey, UUID ownerId, UUID ressourceId) {

}
