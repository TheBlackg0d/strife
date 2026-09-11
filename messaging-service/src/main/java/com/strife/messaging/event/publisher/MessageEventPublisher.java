package com.strife.messaging.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Component;

import com.strife.common.event.MessagePostedEvent;
import com.strife.common.event.Publisher;

@Component
public class MessageEventPublisher extends Publisher {

    private static final String BINDING = "messagePosted-out-0";

    private static final String ROUTING_KEY = "messaging.message.posted";

    public MessageEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void messagePosted(MessagePostedEvent event) {
        publish(BINDING, ROUTING_KEY, event);
    }

}
