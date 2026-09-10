package com.strife.messaging.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.MessageDTO;
import com.strife.messaging.service.ChannelService;
import com.strife.messaging.service.MessageService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/message")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    private final ChannelService channelService;

    @GetMapping("/{channelId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForChannel(@PathVariable UUID channelId,
            @AuthenticationPrincipal JwtPrincipal principal) {

        if (!channelService.memberBelongToChannel(channelId, principal.id())) {
            throw new ActionNotAuthorizedException("Cant view message You dont belong to this channel");
        }

        return ResponseEntity.ok(
                messageService.getMessagesForChannel(channelId).stream().map(MessageDTO::from).toList());
    }
}
