package com.strife.messaging.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.AccountRegisteredEvent;
import com.strife.common.event.RelationshipChangeEvent;
import com.strife.messaging.dto.UserDTO;
import com.strife.messaging.service.PrivateChannelService;
import com.strife.messaging.service.UserService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class UserConsumer {

    private UserService userService;

    public UserConsumer(UserService userService, PrivateChannelService privateChannelService) {
        this.userService = userService;
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
