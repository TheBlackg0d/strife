package com.strife.users.controller;

import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.event.ProfileUpdatedEvent;
import com.strife.common.security.JwtPrincipal;
import com.strife.users.dto.ProfileDTO;
import com.strife.users.event.publisher.ProfileEventPublisher;
import com.strife.users.service.ProfileService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@Slf4j
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;

    private final ProfileEventPublisher profileEventPublisher;

    public ProfileController(ProfileService profileService, ProfileEventPublisher profileEventPublisher) {
        this.profileService = profileService;
        this.profileEventPublisher = profileEventPublisher;
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

        profileEventPublisher.publishProfileUpdatedEvent(event);
        return ResponseEntity.ok(profileDTO);
    }
}
