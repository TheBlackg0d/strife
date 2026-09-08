package com.strife.messaging.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.messaging.dto.MessageDTO;
import com.strife.messaging.service.MessageService;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<List<MessageDTO>> getMethodName(@PathVariable UUID channelId) {
        return ResponseEntity.ok().body(
                messageService.getMessagesForChannel(channelId).stream().map(MessageDTO::from).toList());
    }

}
