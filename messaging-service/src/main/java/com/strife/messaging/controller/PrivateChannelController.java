package com.strife.messaging.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.function.EntityResponse;

import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.PrivateChannelDTO;
import com.strife.messaging.dto.PrivateChannelRequest;
import com.strife.messaging.model.User;
import com.strife.messaging.service.PrivateChannelService;
import com.strife.messaging.service.UserService;

import lombok.AllArgsConstructor;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/private-channel")
@AllArgsConstructor
public class PrivateChannelController {

    private final PrivateChannelService privateChannelService;
    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<PrivateChannelDTO>> getUserPrivateChannel(@PathVariable UUID userId) {
        User user = userService.getUser(userId);
        return ResponseEntity.ok().body(
                user.getPrivateChannels().stream().map(PrivateChannelDTO::from).toList());
    }

    @PostMapping("/create")
    public ResponseEntity<PrivateChannelDTO> createPrivateChannel(@RequestBody PrivateChannelRequest request,
            @AuthenticationPrincipal JwtPrincipal jwtPrincipal) {

        return ResponseEntity.ok(
                PrivateChannelDTO.from(this.privateChannelService.createPrivateChannel(request, jwtPrincipal.id())));
    }

}
