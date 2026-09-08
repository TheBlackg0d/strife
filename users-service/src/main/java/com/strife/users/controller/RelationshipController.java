package com.strife.users.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.common.dto.ResponseDTO;
import com.strife.common.event.RelationshipChangeEvent;
import com.strife.common.model.RelationshipStatus;
import com.strife.common.security.JwtPrincipal;
import com.strife.users.dto.FriendStatusList;
import com.strife.users.dto.RelationshipDTO;
import com.strife.users.dto.UsernameDTO;
import com.strife.users.event.publisher.RelationshipPublisher;
import com.strife.users.model.Profile;
import com.strife.users.service.ProfileService;
import com.strife.users.service.RelationshipService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/relationships")
@Slf4j
@AllArgsConstructor
public class RelationshipController {

    private RelationshipService relationshipService;

    private RelationshipPublisher relationshipPublisher;

    private ProfileService profileService;

    @GetMapping("/friends")
    public ResponseEntity<FriendStatusList> getFriends(@AuthenticationPrincipal JwtPrincipal principal) {
        Profile profile = profileService.getOrCreateProfileById(principal);

        return ResponseEntity.ok(relationshipService.getFriends(profile));
    }

    @PostMapping("/friends")
    public ResponseEntity<RelationshipDTO> sendFriendRequest(@AuthenticationPrincipal JwtPrincipal principal,
            @RequestBody UsernameDTO usernameDTO) {

        Profile profile = profileService.getProfileByEmail(principal.email());
        Profile friend = profileService.findProfileByUsername(usernameDTO.username());

        RelationshipDTO relationshipDTO = relationshipService.sendFriendRequest(profile, friend);

        return ResponseEntity.ok(relationshipDTO);
    }

    @PostMapping("/friends/{friendId}/accept")
    public ResponseEntity<RelationshipDTO> acceptFriendRequest(@AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable UUID friendId) {

        Profile profile = profileService.getProfileByEmail(principal.email());
        Profile friend = profileService.getProfileById(friendId);
        RelationshipDTO relationshipDTO = relationshipService.acceptFriendRequest(profile, friend);

        RelationshipChangeEvent event = new RelationshipChangeEvent(profile.getUserId(), friend.getUserId(),
                relationshipDTO.status());

        relationshipPublisher.publishFriendAddedEvent(event);
        return ResponseEntity.ok(relationshipDTO);
    }

    @PostMapping("/friends/{friendId}/block")
    public ResponseEntity<RelationshipDTO> blockFriend(@AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable UUID friendId) {

        Profile profile = profileService.getProfileByEmail(principal.email());
        Profile friend = profileService.getProfileById(friendId);

        RelationshipDTO relationshipDTO = relationshipService.blockFriend(profile, friend);

        RelationshipChangeEvent event = new RelationshipChangeEvent(profile.getUserId(), friend.getUserId(),
                relationshipDTO.status());

        relationshipPublisher.publishFriendRemovedEvent(event);
        return ResponseEntity.ok(relationshipDTO);
    }

    @PostMapping("/friends/{friendId}/remove")
    public ResponseEntity<ResponseDTO> rejectFriendRequest(@AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable UUID friendId) {

        Profile profile = profileService.getProfileByEmail(principal.email());
        Profile friend = profileService.getProfileById(friendId);

        relationshipService.declineFriendRequest(profile, friend);

        RelationshipChangeEvent event = new RelationshipChangeEvent(profile.getUserId(), friend.getUserId(),
                RelationshipStatus.REMOVED);
        relationshipPublisher.publishFriendRemovedEvent(event);

        return ResponseEntity.ok(new ResponseDTO(HttpStatus.OK.toString(), "Friend has been removed"));
    }

}
