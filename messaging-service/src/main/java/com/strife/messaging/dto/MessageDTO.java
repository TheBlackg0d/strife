package com.strife.messaging.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.strife.common.file.FileUrlSigner;
import com.strife.messaging.model.Message;

public record MessageDTO(UUID id, UUID channelId, String content, List<String> media, UserDTO sender, Instant timestamp,
        Instant editedAt) {


    public static MessageDTO from(Message message, FileUrlSigner signer) {
        return new MessageDTO(
                message.getId(),
                message.getChannel().getId(),
                message.getContent(),
                signedMedia(message.getMedia(), signer),
                UserDTO.from(message.getSender()),
                message.getTimestamp(),
                message.getEditedAt());
    }

    private static List<String> signedMedia(List<UUID> fileIds, FileUrlSigner signer) {
        return fileIds == null ? null : fileIds.stream().map(signer::signedUrl).toList();
    }
}
