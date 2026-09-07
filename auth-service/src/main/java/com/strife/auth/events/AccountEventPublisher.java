package com.strife.auth.events;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;
import com.strife.common.event.AccountRegisteredEvent;
import com.strife.common.event.Publisher;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class AccountEventPublisher extends Publisher {

    private final String BINDING = "accountDispatcher-out-0";
    private final String ROUTING_KEY_ACCOUNT_REGISTERED = "auth.account.registered";

    public AccountEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void publishAccountRegisteredEvent(AccountRegisteredEvent event) {
        this.publish(BINDING, ROUTING_KEY_ACCOUNT_REGISTERED, event);
    }
}
