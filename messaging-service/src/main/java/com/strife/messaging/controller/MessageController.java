package com.strife.messaging.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.event.messaging.MessageDeletedEvent;
import com.strife.common.event.messaging.MessageReactionEvent;
import com.strife.common.event.messaging.MessageUpdatedEvent;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.file.FileUrlSigner;
import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.MessageDTO;
import com.strife.messaging.dto.MessageRequest;
import com.strife.messaging.dto.ReactionRequest;
import com.strife.messaging.event.EventRoutingKey;
import com.strife.messaging.event.publisher.MessageEventPublisher;
import com.strife.messaging.mapper.MessageMapper;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.Reaction;
import com.strife.messaging.model.User;
import com.strife.messaging.service.ChannelService;
import com.strife.messaging.service.MessageService;
import com.strife.messaging.service.UserService;

import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1/message")
@AllArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    private final ChannelService channelService;

    private final UserService userService;

    private final MessageEventPublisher messageEventPublisher;

    private final FileUrlSigner fileUrlSigner;

    @GetMapping("/{channelId}")
    public ResponseEntity<List<MessageDTO>> getMessagesForChannel(@PathVariable UUID channelId,
            @AuthenticationPrincipal JwtPrincipal principal) {

        if (!channelService.memberBelongToChannel(channelId, principal.id())) {
            throw new ActionNotAuthorizedException("Cant view message You dont belong to this channel");
        }

        return ResponseEntity.ok(
                messageService.getMessagesForChannel(channelId).stream()
                        .map(message -> MessageDTO.from(message, fileUrlSigner)).toList());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<MessageDTO> modifiedMessage(@PathVariable UUID id, @RequestBody MessageRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {

        User user = userService.getUser(principal.id());

        MessageDTO messageDto = MessageDTO.from(messageService.updateMessage(id, request, user), fileUrlSigner);

        MessageUpdatedEvent messageUpdatedEvent = MessageMapper.messageDtoToMessageUpdatedEvent(messageDto);

        this.messageEventPublisher.sendMessagingEvent(EventRoutingKey.MESSAGE_UPDATED, messageUpdatedEvent);

        return ResponseEntity.ok(messageDto);
    }

    @PostMapping("/create")
    public ResponseEntity<MessageDTO> createMessage(@RequestBody MessageRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        try {
            User user = userService.getUser(principal.id());
            Channel channel = channelService.getChannel(request.channelId());

            if (!channelService.memberBelongToChannel(channel.getId(), principal.id())) {
                throw new ActionNotAuthorizedException("Cant send message You dont belong to this channel");
            }

            MessageDTO messageDto = MessageDTO.from(messageService.createMessage(request, channel, user),
                    fileUrlSigner);

            log.info("this is messageDto: {}", messageDto);

            MessageUpdatedEvent messagePostedEvent = MessageMapper.messageDtoToMessageUpdatedEvent(messageDto);

            this.messageEventPublisher.sendMessagingEvent(EventRoutingKey.MESSAGE_POSTED, messagePostedEvent);
            return ResponseEntity.ok(messageDto);
        } catch (Exception e) {
            log.error("{}", e);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{messageId}/reaction/reaction")
    public ResponseEntity<Void> toggleReaction(@RequestBody ReactionRequest reactionRequest,
            @PathVariable UUID messageId, @AuthenticationPrincipal JwtPrincipal principal) {
        User user = this.userService.getUser(principal.id());
        EventRoutingKey eventRoutingKey = this.messageService.toggleReaction(reactionRequest, user);

        this.messageEventPublisher.sendMessagingEvent(
                eventRoutingKey,
                new MessageReactionEvent(reactionRequest.messageId(), user.getId(), reactionRequest.channelId(),
                        reactionRequest.emoji()));

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable UUID messageId,
            @AuthenticationPrincipal JwtPrincipal principal) {
        List<UUID> fileIdsToDeleteList = messageService.deleteMessage(messageId, principal.id());
        this.messageEventPublisher.sendMessagingEvent(EventRoutingKey.MESSAGE_DELETED,
                new MessageDeletedEvent(fileIdsToDeleteList));

        return ResponseEntity.ok().build();
    }
}
