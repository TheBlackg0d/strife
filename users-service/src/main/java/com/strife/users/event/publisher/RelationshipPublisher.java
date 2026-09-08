package com.strife.users.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Publisher;

import com.strife.common.event.RelationshipChangeEvent;

@Configuration
public class RelationshipPublisher extends Publisher {
    private final String BINDING = "relationshipDispatcher-out-0";

    public RelationshipPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    @Bean
    void publishFriendAddedEvent(RelationshipChangeEvent event) {
        this.publish(BINDING, "user.relationship.added", event);
    }

    @Bean
    void publishFriendRemovedEvent(RelationshipChangeEvent event) {
        this.publish(BINDING, "user.relationship.removed", event);
    }

}
