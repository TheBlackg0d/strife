package com.strife.guild.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Component;

import com.strife.common.event.Publisher;
import com.strife.guild.event.EventRoutingKey;

@Component
public class ChannelPublisher extends Publisher {

    private static final String BINDING = "channelCreated-out-0";

    public ChannelPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public <T> void sendChannelEvent(EventRoutingKey key, T event) {
        publish(BINDING, key.getRoutingKey(), event);
    }
}
