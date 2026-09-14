package com.strife.users.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Publisher;
import com.strife.common.event.Profile.RelationshipChangeEvent;
import com.strife.users.event.EventRoutingKey;

@Configuration
public class RelationshipPublisher extends Publisher {
    private final String BINDING = "relationshipDispatcher-out-0";

    public RelationshipPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void publishFriendChangeEvent(EventRoutingKey key, RelationshipChangeEvent event) {
        this.publish(BINDING, key.value(), event);
    }
}
