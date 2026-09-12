package com.strife.common.event.file;

import java.util.UUID;

import com.strife.common.model.FileScope;

public record FileOwnerChangeEvent(UUID ownerId, UUID ressourceId, FileScope scope) {

}
