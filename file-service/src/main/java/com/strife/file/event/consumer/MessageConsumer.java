package com.strife.file.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.messaging.MessageDeletedEvent;
import com.strife.file.service.FileService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@AllArgsConstructor
public class MessageConsumer {

    private final FileService fileService;

    @Bean
    Consumer<MessageDeletedEvent> messageDeletedConsumer() {
        return event -> {
            log.info("Received message deleted event: {}", event);
            event.fileId().forEach(fileService::deleteFile);
        };
    }
}
