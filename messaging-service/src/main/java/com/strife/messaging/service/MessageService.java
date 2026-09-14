package com.strife.messaging.service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.messaging.dto.MessageRequest;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.Message;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.MessageRepository;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> getMessagesForChannel(UUID channelId) {
        return messageRepository.findByChannelIdOrderByTimestampAsc(channelId);
    }

    @Transactional
    public Message createMessage(MessageRequest request, Channel channel, User user) {

        Message message = new Message();

        message.setChannel(channel);
        message.setContent(request.content());
        message.setMedia(request.media());
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
        message.setMedia(request.media());
        message.setEditedAt(Instant.now());

        return messageRepository.save(message);
    }
}
