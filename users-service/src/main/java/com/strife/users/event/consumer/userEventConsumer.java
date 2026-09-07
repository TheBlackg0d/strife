package com.strife.users.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.AccountRegisteredEvent;
import com.strife.common.security.JwtPrincipal;
import com.strife.users.service.ProfileService;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class userEventConsumer {

    private ProfileService profileService;

    public userEventConsumer(ProfileService profileService) {
        this.profileService = profileService;
    }

    @Bean
    Consumer<AccountRegisteredEvent> createProfileConsumer() {
        return event -> {
            log.info("Received event: {}", event);
            JwtPrincipal principal = new JwtPrincipal(event.userId(), event.email(), event.username());
            profileService.createProfile(principal);
        };
    }
}
