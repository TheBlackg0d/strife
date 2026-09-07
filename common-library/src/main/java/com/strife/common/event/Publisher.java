package com.strife.common.event;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;

public abstract class Publisher {
    static final String ROUTING_KEY = "routingKey";

    protected final Logger log = LoggerFactory.getLogger(getClass());

    private final StreamBridge streamBridge;

    public Publisher(StreamBridge streamBridge) {
        this.streamBridge = streamBridge;
    }

    public <T> void publish(String binding, String routingKey, T event) {
        log.info("Publishing event on binding {} with routing key {}: {}", binding, routingKey, event);
        Message<T> message = MessageBuilder.withPayload(event)
                .setHeader(ROUTING_KEY, routingKey)
                .build();

        streamBridge.send(binding, message);
    }
}
