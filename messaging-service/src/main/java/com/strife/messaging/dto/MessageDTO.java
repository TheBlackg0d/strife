package com.strife.messaging.dto;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.strife.common.event.messaging.MediaAttachment;
import com.strife.common.file.FileUrlSigner;
import com.strife.messaging.model.Message;
import com.strife.messaging.model.MessageMedia;

public record MessageDTO(UUID id, UUID channelId, String content, List<MediaAttachment> media, UserDTO sender,
                List<ReactionGroupDTO> reactions,
                Instant timestamp, Instant editedAt) {

        public static MessageDTO from(Message message, FileUrlSigner signer) {
                return new MessageDTO(
                                message.getId(),
                                message.getChannel().getId(),
                                message.getContent(),
                                signedMedia(message.getMedia(), signer),
                                UserDTO.from(message.getSender()),
                                mapReactions(message),
                                message.getTimestamp(),
                                message.getEditedAt());
        }

        private static List<MediaAttachment> signedMedia(List<MessageMedia> media, FileUrlSigner signer) {
                return media == null ? null
                                : media.stream()
                                                .map(m -> new MediaAttachment(m.getFileId(),
                                                                signer.signedUrl(m.getFileId()),
                                                                m.getContentType(), m.getOriginalName()))
                                                .toList();

        }

        private static List<ReactionGroupDTO> mapReactions(Message message) {
                Map<String, Integer> reactionCounts = new HashMap<>();
                message.getReactions().forEach(r -> reactionCounts.put(r.getEmoji(),
                                reactionCounts.getOrDefault(r.getEmoji(), 0) + 1));

                return reactionCounts.entrySet().stream()
                                .map(e -> ReactionGroupDTO.from(e.getKey(),
                                                message.getReactions().stream()
                                                                .filter(r -> r.getEmoji().equals(e.getKey()))
                                                                .map(ReactionDTO::from)
                                                                .toList()))
                                .toList();
        }
}
