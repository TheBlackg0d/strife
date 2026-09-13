package com.strife.file.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.channel.ChannelUpsertedEvent;
import com.strife.file.service.ChannelService;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class ChannelConsumer {

    private final ChannelService channelService;

    @Bean
    Consumer<ChannelUpsertedEvent> channelUpsertedConsumer() {
        return channelService::upsertChannel;
    }
}
