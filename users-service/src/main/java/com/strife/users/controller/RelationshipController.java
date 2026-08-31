package com.strife.users.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.users.dto.FriendStatusList;
import com.strife.users.dto.RelationshipDTO;
import com.strife.users.dto.UsernameDTO;
import com.strife.users.model.Profile;
import com.strife.users.service.ProfileService;
import com.strife.users.service.RelationshipService;

@RestController
@RequestMapping("/api/v1/relationships")
public class RelationshipController {

    private RelationshipService relationshipService;

    private ProfileService profileService;

    public RelationshipController(RelationshipService relationshipService, ProfileService profileService) {
        this.relationshipService = relationshipService;
        this.profileService = profileService;
    }

    @GetMapping("/friends")
    public ResponseEntity<FriendStatusList> getFriends(@RequestHeader("x-auth-user-email") String email) {

        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }

        Profile profile = profileService.getProfileByEmail(email);

        return ResponseEntity.ok(relationshipService.getFriends(profile));
    }

    @PostMapping("/friends")
    public ResponseEntity<RelationshipDTO> sendFriendRequest(@RequestHeader("x-auth-user-email") String email,
            @RequestBody UsernameDTO usernameDTO) {

        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }
        Profile profile = profileService.getProfileByEmail(email);
        Profile friend = profileService.findProfileByUsernameAndDiscriminator(usernameDTO.username(),
                usernameDTO.discriminator());

        return ResponseEntity.ok(relationshipService.sendFriendRequest(profile, friend));
    }

    @PostMapping("/friends/{friendId}/accept")
    public ResponseEntity<RelationshipDTO> acceptFriendRequest(@RequestHeader("x-auth-user-email") String email,
            @PathVariable UUID friendId) {

        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }

        Profile profile = profileService.getProfileByEmail(email);
        Profile friend = profileService.getProfileById(friendId);

        return ResponseEntity.ok(relationshipService.acceptFriendRequest(profile, friend));
    }

    @PostMapping("/friends/{friendId}/remove")
    public ResponseEntity<String> rejectFriendRequest(@RequestHeader("x-auth-user-email") String email,
            @PathVariable UUID friendId) {

        if (email == null) {
            throw new IllegalArgumentException("Email is required");
        }

        Profile profile = profileService.getProfileByEmail(email);
        Profile friend = profileService.getProfileById(friendId);

        relationshipService.declineFriendRequest(profile, friend);

        return ResponseEntity.ok("Friend request rejected");
    }

}
