package com.strife.users.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.common.dto.UserDTO;
import com.strife.common.event.auth.AccountRegisteredEvent;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.DmPrivacy;
import com.strife.common.security.JwtPrincipal;

import com.strife.users.dto.ProfileDTO;
import com.strife.users.model.Profile;
import com.strife.users.model.StatusPreference;
import com.strife.users.repository.ProfileRepository;

@Service
public class ProfileService {

    private ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile getOrCreateProfileById(JwtPrincipal jwtPrincipal) {
        return this.profileRepository.findById(jwtPrincipal.id()).orElse(this.createProfile(jwtPrincipal));
    }

    public Profile getProfileByEmail(String email) {
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNotFoundException("Profile not found"));
    }

    public Profile getProfileById(UUID userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new RessourceNotFoundException("Profile not found"));
    }

    public Profile createProfile(JwtPrincipal user) {

        Profile newProfile = new Profile();
        newProfile.setUserId(user.id());
        newProfile.setEmail(user.email());
        newProfile.setAvatar(null);
        newProfile.setBio(null);
        newProfile.setStatusPreference(StatusPreference.ONLINE);
        newProfile.setDmPrivacy(DmPrivacy.FRIENDS);
        newProfile.setVersion(1l);

        newProfile.setUsername(user.username());

        return profileRepository.save(newProfile);
    }

    public Profile updateProfile(ProfileDTO profileDTO, UUID profileId) {
        Profile profile = getProfileById(profileId);

        profile.setUsername(profileDTO.username());
        profile.setEmail(profileDTO.email());
        profile.setBio(profileDTO.bio());

        return profileRepository.save(profile);
    }

    public Profile findProfileByUsername(String username) {
        return profileRepository.findByUsername(username)
                .orElseThrow(() -> new RessourceNotFoundException(
                        "Hum, ce nom d'utilisateur n'existe pas. Vérifie l'orthographe."));
    }
}
