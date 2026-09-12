package com.strife.gateway.realtime.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.strife.common.event.messaging.MessagePostedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class MessageBroadcaster {
    private static final String CHANNEL_TOPIC = "/topic/channel.";

    private final SimpMessagingTemplate messagingTemplate;

    @Bean
    Consumer<MessagePostedEvent> messagePostedEventConsumer() {
        return event -> {
            log.info("Received message posted event: {}", event);
            String destination = CHANNEL_TOPIC + event.channelId();

            messagingTemplate.convertAndSend(destination, event);
        };
    }
}
