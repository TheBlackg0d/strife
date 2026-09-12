package com.strife.file.event.consumer;

import java.util.function.Consumer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.file.FileOwnerChangeEvent;
import com.strife.common.model.FileScope;
import com.strife.file.service.FileService;

import lombok.AllArgsConstructor;

@Configuration
@AllArgsConstructor
public class FileConsumer {

    private final FileService fileService;

    @Bean
    Consumer<FileOwnerChangeEvent> fileOwnerChangeConsumer() {
        return event -> {
            fileService.updateFileOwnership(event);
        };
    }
}
