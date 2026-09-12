package com.strife.users.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Publisher;
import com.strife.common.event.Profile.ProfileUpdatedEvent;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ProfileEventPublisher extends Publisher {

    static final String BINDING = "profileUpdatedEvent-out-0";

    public ProfileEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void publishProfileUpdatedEvent(ProfileUpdatedEvent event) {
        this.publish(BINDING, "user.profile.updated", event);
    }
}
