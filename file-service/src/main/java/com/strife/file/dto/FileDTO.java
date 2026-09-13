package com.strife.file.dto;

import java.util.UUID;

import com.strife.common.file.FileUrlSigner;
import com.strife.file.model.File;

public record FileDTO(UUID id, String url, String originalName, String contentType, UUID ownerId, UUID channelId) {

    /**
     * {@code url} est une URL signée à durée de vie courte : utilisable
     * directement dans un {@code <img src>}, mais jamais à persister — elle
     * expire. Côté messages, on stocke l'identifiant et on resigne à la
     * lecture.
     */
    public static FileDTO fromEntity(File file, FileUrlSigner signer) {
        return new FileDTO(file.getId(), signer.signedUrl(file.getId()), file.getOriginalName(),
                file.getContentType(), file.getOwnerId(),
                file.getChannel() == null ? null : file.getChannel().getId());
    }

}
