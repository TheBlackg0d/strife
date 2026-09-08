package com.strife.messaging.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.messaging.model.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    List<Message> findByChannelId(UUID channelId);
}
