package com.strife.users.dto;

import java.util.UUID;

import com.strife.common.model.DmPrivacy;
import com.strife.users.model.Profile;
import com.strife.users.model.StatusPreference;

public record ProfileDTO(UUID id, String username, String email, String bio, String avatarUrl,
        StatusPreference statusPreference, DmPrivacy dmPrivacy) {

    public static ProfileDTO fromEntity(Profile profile) {
        return new ProfileDTO(profile.getUserId(), profile.getUsername(), profile.getEmail(), profile.getBio(),
                profile.getAvatar(), profile.getStatusPreference(), profile.getDmPrivacy());
    }

}
