package com.strife.auth.events;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.auth.service.AccountService;
import com.strife.common.event.ProfileUpdatedEvent;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class ProfileChangeEvent {

    private final AccountService accountService;

    public ProfileChangeEvent(AccountService accountService) {
        this.accountService = accountService;
    }

    @Bean
    Consumer<ProfileUpdatedEvent> profileUpdatedEventConsumer() {
        return event -> {
            log.info("Received profile updated event: {}", event);
            accountService.updateAccount(event);
        };
    }

}
