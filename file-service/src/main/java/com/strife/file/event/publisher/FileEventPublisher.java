package com.strife.file.event.publisher;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.context.annotation.Configuration;

import com.strife.common.event.Publisher;
import com.strife.common.event.file.FileCreatedEvent;
import com.strife.common.model.FileScope;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
public class FileEventPublisher extends Publisher {

    private StreamBridge streamBridge;

    private final String BINDING = "fileDispatcher-out-0";

    public FileEventPublisher(StreamBridge streamBridge) {
        super(streamBridge);
    }

    public void publishFileCreatedEvent(FileCreatedEvent event) {
        this.publish(BINDING, "file." + event.scope().getScope() + ".created", event);

    }

}
