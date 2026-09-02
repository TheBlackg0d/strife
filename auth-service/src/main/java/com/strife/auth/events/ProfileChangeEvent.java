package com.strife.auth.events;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.strife.auth.config.RabbitMqConfig;
import com.strife.auth.service.AccountService;
import com.strife.common.event.ProfileUpdatedEvent;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ProfileChangeEvent {

    private final AccountService accountService;

    public ProfileChangeEvent(AccountService accountService) {
        this.accountService = accountService;
    }

    @RabbitListener(queues = RabbitMqConfig.QUEUE_NAME)
    public void handleProfileChangeEvent(ProfileUpdatedEvent userDTO) {
        log.info("Received profile change event for user: {}", userDTO);
        accountService.updateAccount(userDTO);
    }
}
