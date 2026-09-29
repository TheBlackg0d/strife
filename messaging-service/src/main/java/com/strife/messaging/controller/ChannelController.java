package com.strife.messaging.controller;

import java.util.List;
import java.util.UUID;

import com.strife.messaging.service.MessageService;
import com.strife.messaging.service.UserService;
import com.strife.messaging.mapper.ChannelMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.file.FileUrlSigner;
import com.strife.common.security.JwtPrincipal;
import com.strife.messaging.dto.ChannelDTO;
import com.strife.messaging.dto.ChannelPageDTO;
import com.strife.messaging.dto.DmRequest;
import com.strife.messaging.dto.GroupDmRequest;
import com.strife.messaging.dto.UserDTO;
import com.strife.messaging.service.ChannelService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/channel")
@AllArgsConstructor
public class ChannelController {

        private final ChannelService channelService;
        private final UserService userService;
        private final FileUrlSigner fileUrlSigner;

        @GetMapping("")
        public ResponseEntity<List<ChannelDTO>> getPrivateChannels(@AuthenticationPrincipal JwtPrincipal principal) {
                List<ChannelDTO> channelDTOs = channelService.getPrivateChannels(principal.id()).stream()
                                .map(channel -> ChannelMapper.toChannelDTO(channel, principal))
                                .toList();

                return ResponseEntity.ok(channelDTOs);
        }

        @GetMapping("/friend/{friendId}")
        public ResponseEntity<ChannelDTO> getDmChannel(@PathVariable UUID friendId,
                        @AuthenticationPrincipal JwtPrincipal principal) {
                return ResponseEntity.ok(
                                ChannelMapper.toChannelDTO(
                                                channelService.getDmChannelByFriendId(friendId, principal.id()),
                                                principal));
        }

        @GetMapping("/{channelId}")
        public ResponseEntity<ChannelPageDTO> getChannel(@PathVariable UUID channelId,
                        @AuthenticationPrincipal JwtPrincipal principal) {

                List<UserDTO> friends = userService.getUser(principal.id()).getFriends().stream()
                                .map(UserDTO::from)
                                .toList();

                ChannelPageDTO channelPageDTO = ChannelMapper.toChannelPageDTO(
                                channelService.getChannelForMember(channelId, principal.id()),
                                fileUrlSigner,
                                principal,
                                friends);

                return ResponseEntity.ok(channelPageDTO);
        }

        @PostMapping("/dm")
        public ResponseEntity<ChannelDTO> createDm(@RequestBody DmRequest request,
                        @AuthenticationPrincipal JwtPrincipal principal) {
                return ResponseEntity
                                .ok(ChannelMapper.toChannelDTO(channelService.createDm(request, principal.id()),
                                                principal));
        }

        @PostMapping("/group")
        public ResponseEntity<ChannelDTO> createGroupDm(@RequestBody GroupDmRequest request,
                        @AuthenticationPrincipal JwtPrincipal principal) {
                return ResponseEntity
                                .ok(ChannelMapper.toChannelDTO(channelService.createGroupDm(request, principal.id()),
                                                principal));
        }
}
