package com.strife.messaging.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Component;

import com.strife.common.event.Publisher;
import com.strife.common.event.file.FileOwnerChangeEvent;
import com.strife.common.event.messaging.MessagePostedEvent;

@Component
public class MessageEventPublisher extends Publisher {

    private static final String BINDING = "messagePosted-out-0";

    private static final String FILE_OWNER_BINDING = "fileOwnerChanged-out-0";

    private static final String ROUTING_KEY = "messaging.message.posted";

    private static final String FILE_OWNER_ROUTING_KEY = "messaging.file.owner.changed";

    public MessageEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void messagePosted(MessagePostedEvent event) {
        publish(BINDING, ROUTING_KEY, event);
    }

    public void fileOwnerChanged(FileOwnerChangeEvent event) {
        publish(FILE_OWNER_BINDING, FILE_OWNER_ROUTING_KEY, event);
    }

}
