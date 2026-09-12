package com.strife.users.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Publisher;
import com.strife.common.event.Profile.RelationshipChangeEvent;

@Configuration
public class RelationshipPublisher extends Publisher {
    private final String BINDING = "relationshipDispatcher-out-0";

    public RelationshipPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void publishFriendAddedEvent(RelationshipChangeEvent event) {
        this.publish(BINDING, "user.relationship.added", event);
    }

    public void publishFriendRemovedEvent(RelationshipChangeEvent event) {
        this.publish(BINDING, "user.relationship.removed", event);
    }

}
