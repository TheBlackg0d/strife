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

import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.ChannelDTO;
import com.strife.messaging.dto.DmRequest;
import com.strife.messaging.dto.GroupDmRequest;
import com.strife.messaging.service.ChannelService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/channel")
@AllArgsConstructor
public class ChannelController {

    private final ChannelService channelService;

    @GetMapping("")
    public ResponseEntity<List<ChannelDTO>> getPrivateChannels(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(
                channelService.getPrivateChannels(principal.id()).stream().map(ChannelDTO::from).toList());
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<ChannelDTO> getChannel(@PathVariable UUID channelId,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(ChannelDTO.from(channelService.getChannelForMember(channelId, principal.id())));
    }

    @PostMapping("/dm")
    public ResponseEntity<ChannelDTO> createDm(@RequestBody DmRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(ChannelDTO.from(channelService.createDm(request, principal.id())));
    }

    @PostMapping("/group")
    public ResponseEntity<ChannelDTO> createGroupDm(@RequestBody GroupDmRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(ChannelDTO.from(channelService.createGroupDm(request, principal.id())));
    }
}
