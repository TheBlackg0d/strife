package com.strife.messaging.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Component;

import com.strife.common.event.Publisher;
import com.strife.messaging.event.EventRoutingKey;

@Component
public class MessageEventPublisher extends Publisher {

    private static final String BINDING = "messagePosted-out-0";

    public MessageEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public <T> void sendMessagingEvent(EventRoutingKey key, T event) {
        publish(BINDING, key.getValue(), event);
    }

}
