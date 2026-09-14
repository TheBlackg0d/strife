package com.strife.gateway.realtime.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.strife.common.event.Profile.RelationshipChangeEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class RelationshipBroadcaster {

    private static final String CHANNEL_TOPIC = "/topic/relationship.";

    private final SimpMessagingTemplate messagingTemplate;

    @Bean
    Consumer<RelationshipChangeEvent> relationshipChangeEventConsumer() {
        return event -> {
            log.info("Received relationship change event: {}", event);
            String destination = CHANNEL_TOPIC + event.friendId();
            messagingTemplate.convertAndSend(destination, event);
        };
    }

}
