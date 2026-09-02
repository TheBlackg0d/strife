package com.strife.users.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.event.ProfileUpdatedEvent;
import com.strife.common.security.JwtPrincipal;
import com.strife.common.services.MessageService;
import com.strife.users.config.RabbitMqConfig;
import com.strife.users.dto.ProfileDTO;
import com.strife.users.service.ProfileService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@Slf4j
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    private final MessageService messageService;

    public ProfileController(ProfileService profileService, MessageService messageService) {
        this.profileService = profileService;
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<ProfileDTO> getProfile(@AuthenticationPrincipal JwtPrincipal principal) {
        log.info("Getting profile for user with id: {}", principal.id());
        return ResponseEntity.ok(ProfileDTO.fromEntity(profileService.getProfileById(principal.id())));
    }

    @PutMapping("/update")
    public ResponseEntity<ProfileDTO> updateProfile(@AuthenticationPrincipal JwtPrincipal principal,
            @RequestBody ProfileDTO profile) {

        ProfileDTO profileDTO = ProfileDTO.fromEntity(profileService.updateProfile(profile, principal.id()));

        ProfileUpdatedEvent event = new ProfileUpdatedEvent(profileDTO.id(), profileDTO.username(), profileDTO.email());

        messageService.sendMessage(event, "user.profile.updated", RabbitMqConfig.EXCHANGE);
        return ResponseEntity.ok(profileDTO);
    }
}
