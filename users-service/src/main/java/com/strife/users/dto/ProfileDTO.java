package com.strife.users.dto;

import java.util.UUID;

import com.strife.users.model.Profile;

public record ProfileDTO(UUID id, String username, String email, String bio, String avatarUrl) {

    public static ProfileDTO fromEntity(Profile profile) {
        return new ProfileDTO(profile.getUserId(), profile.getUsername(), profile.getEmail(), profile.getBio(),
                profile.getAvatar());
    }

}
