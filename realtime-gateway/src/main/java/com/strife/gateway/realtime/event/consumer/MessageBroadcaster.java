package com.strife.gateway.realtime.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.gateway.realtime.dto.MessageBroadcastDTO;
import com.strife.gateway.realtime.event.EventActionType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class MessageBroadcaster {
    private static final String CHANNEL_TOPIC = "/topic/channel.";

    private final SimpMessagingTemplate messagingTemplate;

    @Bean
    Consumer<MessageUpdatedEvent> messagePostedEventConsumer() {
        return event -> {
            log.info("Received message posted event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();
            messagingTemplate.convertAndSend(destination, MessageBroadcastDTO.created(event));
        };
    }

    @Bean
    Consumer<MessageUpdatedEvent> messageUpdatedEventConsumer() {
        return event -> {
            log.info("Received message updated event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();
            messagingTemplate.convertAndSend(destination, MessageBroadcastDTO.updated(event));
        };
    }

}
