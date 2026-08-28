package com.strife.users.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.strife.users.config.RabbitMqConfig;
import com.strife.users.dto.userDTO;
import com.strife.users.service.ProfileService;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class AccountEventListener {

    private final ProfileService profileService;

    public AccountEventListener(ProfileService profileService) {
        this.profileService = profileService;
    }

    @RabbitListener(queues = RabbitMqConfig.QUEUE)
    public void receiveAccountCreatedEvent(userDTO user) {
        log.info("Received account created event: {}", user);
        profileService.createProfile(user);

    }
}
