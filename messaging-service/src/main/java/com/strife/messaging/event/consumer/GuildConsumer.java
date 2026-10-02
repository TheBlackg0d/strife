package com.strife.messaging.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.guild.ChannelCreatedEvent;
import com.strife.messaging.service.ChannelService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class GuildConsumer {

    private final ChannelService channelService;

    public GuildConsumer(ChannelService channelService) {
        this.channelService = channelService;
    }

    @Bean
    Consumer<ChannelCreatedEvent> guildChannelCreatedEventConsumer() {
        return event -> {
            log.info("Received guild channel created event: {}", event);
            channelService.createGuildChannel(event);
        };
    }
}
