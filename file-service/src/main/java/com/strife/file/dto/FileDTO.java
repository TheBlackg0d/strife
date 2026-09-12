package com.strife.file.dto;

import java.util.UUID;

import com.strife.common.event.file.FileOwnerChangeEvent;
import com.strife.common.model.FileScope;
import com.strife.file.model.File;

public record FileDTO(UUID id, String url, UUID ownerId, UUID ressourceId, FileScope scope) {

    public static FileDTO fromEntity(File file) {
        return new FileDTO(file.getId(), file.getFileUrl(), file.getOwnerId(), file.getRessourceId(), file.getScope());
    }

    public static FileDTO fromEvent(FileOwnerChangeEvent event) {
        return new FileDTO(null, null, event.ownerId(), event.ressourceId(), event.scope());
    }

}
