package com.strife.messaging.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Profile.RelationshipChangeEvent;
import com.strife.common.event.auth.AccountRegisteredEvent;
import com.strife.messaging.dto.UserDTO;
import com.strife.messaging.service.ChannelService;
import com.strife.messaging.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class UserConsumer {

    private UserService userService;
    private ChannelService channelService;

    public UserConsumer(UserService userService, ChannelService channelService) {
        this.userService = userService;
        this.channelService = channelService;
    }

    @Bean
    Consumer<AccountRegisteredEvent> accountCreatedEventConsumer() {
        return event -> {
            log.info("Received account created event: {}", event);
            UserDTO userDTO = new UserDTO(event.userId(), event.username());
            userService.createUser(userDTO);
        };
    }

    @Bean
    Consumer<RelationshipChangeEvent> relationshipChangeEventConsumer() {
        return event -> {
            log.info("Received relationship change event: {}", event);
            userService.updateFriendship(event);
        };
    }
}
