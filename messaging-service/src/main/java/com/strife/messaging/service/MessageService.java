package com.strife.messaging.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.messaging.dto.MediaRequest;
import com.strife.messaging.dto.MessageRequest;
import com.strife.messaging.dto.ReactionRequest;
import com.strife.messaging.event.EventRoutingKey;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.Message;
import com.strife.messaging.model.MessageMedia;
import com.strife.messaging.model.Reaction;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.MessageRepository;
import com.strife.messaging.repository.ReactionRepository;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    private final ReactionRepository reactionRepository;

    public MessageService(MessageRepository messageRepository, ReactionRepository reactionRepository) {
        this.messageRepository = messageRepository;
        this.reactionRepository = reactionRepository;
    }

    public List<Message> getMessagesForChannel(UUID channelId) {
        return messageRepository.findByChannelIdOrderByTimestampAsc(channelId);
    }

    @Transactional
    public Message createMessage(MessageRequest request, Channel channel, User user) {

        Message message = new Message();

        message.setChannel(channel);
        message.setContent(request.content());
        message.setMedia(toMedia(request.media()));
        message.setTimestamp(Instant.now());
        message.setSender(user);
        message.setEditedAt(null);

        return messageRepository.save(message);
    }

    @Transactional
    public Message updateMessage(UUID messageId, MessageRequest request, User user) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RessourceNotFoundException("Message not found"));

        if (!message.getSender().getId().equals(user.getId())) {
            throw new ActionNotAuthorizedException("You are not authorized to edit this message");
        }

        message.setContent(request.content());
        message.setMedia(toMedia(request.media()));
        message.setEditedAt(Instant.now());

        return messageRepository.save(message);
    }

    public List<UUID> deleteMessage(UUID messageId, UUID userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RessourceNotFoundException("Message not found"));

        if (!message.getSender().getId().equals(userId)) {
            throw new ActionNotAuthorizedException("You are not authorized to delete this message");
        }

        List<UUID> mediaIds = message.getMedia().stream()
                .map(MessageMedia::getFileId)
                .toList();

        messageRepository.delete(message);

        return mediaIds;
    }

    @Transactional
    public Reaction toggleReaction(ReactionRequest request, User user) {
        Message message = messageRepository.findById(request.messageId())
                .orElseThrow(() -> new RessourceNotFoundException("Message not found"));
        if (!message.getChannel().getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()))) {
            throw new ActionNotAuthorizedException("You are not authorized to react to this message");
        }

        Reaction reaction = reactionRepository
                .findByMessageIdAndUserIdAndEmoji(request.messageId(), user.getId(), request.emoji())
                .orElse(null);

        if (reaction == null) {
            return reactionRepository.save(new Reaction(message, user, request.emoji()));
        }

        reactionRepository.delete(reaction);

        return null;

    }

    private List<MessageMedia> toMedia(List<MediaRequest> media) {
        return media == null ? null
                : media.stream()
                        .map(m -> new MessageMedia(m.fileId(), m.contentType(), m.originalName()))
                        .collect(Collectors.toCollection(ArrayList::new));
    }
}
