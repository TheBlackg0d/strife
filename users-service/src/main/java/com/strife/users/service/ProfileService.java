package com.strife.users.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.common.dto.UserDTO;
import com.strife.users.model.DmPrivacy;
import com.strife.users.model.Profile;
import com.strife.users.model.StatusPreference;
import com.strife.users.repository.ProfileRepository;

@Service
public class ProfileService {

    private ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile getProfileByEmail(String email) {
        return profileRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile getProfileById(UUID userId) {
        return profileRepository.findById(userId).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    public Profile createProfile(UserDTO user) {

        Profile newProfile = new Profile();
        newProfile.setUserId(user.id());
        newProfile.setEmail(user.email());
        newProfile.setAvatar(null);
        newProfile.setBio(null);
        newProfile.setStatusPreference(StatusPreference.ONLINE);
        newProfile.setDmPrivacy(DmPrivacy.EVERYONE);
        newProfile.setVersion(1l);

        newProfile.setUsername(user.username());

        return profileRepository.save(newProfile);
    }

    public Profile findProfileByUsernameAndDiscriminator(String username, String discriminator) {
        return profileRepository.findByUsernameAndDiscriminator(username, discriminator)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}
