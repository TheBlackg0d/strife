package com.strife.messaging.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.messaging.model.Message;
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
}
