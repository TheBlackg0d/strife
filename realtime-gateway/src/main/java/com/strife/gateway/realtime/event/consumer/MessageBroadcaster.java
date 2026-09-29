package com.strife.gateway.realtime.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.strife.common.event.messaging.MessageReactionEvent;
import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.gateway.realtime.dto.MessageBroadcastDTO;
import com.strife.gateway.realtime.dto.ReactionBroadcastDTO;
import com.strife.gateway.realtime.event.MessageEventActionType;
import com.strife.gateway.realtime.event.ReactionEventActionType;

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
            messagingTemplate.convertAndSend(destination,
                    new MessageBroadcastDTO(MessageEventActionType.MESSAGE_CREATED, event));
        };
    }

    @Bean
    Consumer<MessageUpdatedEvent> messageUpdatedEventConsumer() {
        return event -> {
            log.info("Received message updated event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();
            messagingTemplate.convertAndSend(destination,
                    new MessageBroadcastDTO(MessageEventActionType.MESSAGE_UPDATED, event));
        };
    }

    @Bean
    Consumer<MessageReactionEvent> messageReactionCreatedEventConsumer() {
        return event -> {
            log.info("Received message reaction created event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();
            messagingTemplate.convertAndSend(destination,
                    new ReactionBroadcastDTO(ReactionEventActionType.REACTION_CREATED, event));
        };
    }

    @Bean
    Consumer<MessageReactionEvent> messageReactionDeletedEventConsumer() {
        return event -> {
            log.info("Received message reaction deleted event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();
            messagingTemplate.convertAndSend(destination,
                    new ReactionBroadcastDTO(ReactionEventActionType.REACTION_DELETED, event));
        };
    }

}
