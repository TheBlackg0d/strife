package com.strife.messaging.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.event.messaging.MessagePostedEvent;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.MessageDTO;
import com.strife.messaging.dto.MessageRequest;
import com.strife.messaging.event.publisher.MessageEventPublisher;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.Message;
import com.strife.messaging.model.User;
import com.strife.messaging.service.ChannelService;
import com.strife.messaging.service.MessageService;
import com.strife.messaging.service.UserService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/message")
@AllArgsConstructor
public class MessageController {

    private final MessageService messageService;

    private final ChannelService channelService;

    private final UserService userService;

    private final MessageEventPublisher messageEventPublisher;

    @GetMapping("/{channelId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForChannel(@PathVariable UUID channelId,
            @AuthenticationPrincipal JwtPrincipal principal) {

        if (!channelService.memberBelongToChannel(channelId, principal.id())) {
            throw new ActionNotAuthorizedException("Cant view message You dont belong to this channel");
        }

        return ResponseEntity.ok(
                messageService.getMessagesForChannel(channelId).stream().map(MessageDTO::from).toList());
    }

    @PostMapping("/create")
    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {

        User user = userService.getUser(principal.id());
        Channel channel = channelService.getChannel(request.channelId());

        if (!channelService.memberBelongToChannel(channel.getId(), principal.id())) {
            throw new ActionNotAuthorizedException("Cant send message You dont belong to this channel");
        }

        MessageDTO messageDto = MessageDTO.from(messageService.createMessage(request, channel, user));

        MessagePostedEvent messagePostedEvent = new MessagePostedEvent(
                messageDto.id(),
                messageDto.channelId(),
                messageDto.sender().id(),
                messageDto.sender().username(),
                messageDto.content(),
                messageDto.timestamp());

        this.messageEventPublisher.messagePosted(messagePostedEvent);

        return ResponseEntity.ok(messageDto);
    }
}
