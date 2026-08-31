package com.strife.users.service;

import java.util.Optional;
import java.util.UUID;

import javax.management.RuntimeErrorException;

import org.springframework.stereotype.Service;

import com.strife.users.dto.userDTO;
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

    public Profile createProfile(userDTO user) {

        Profile newProfile = new Profile();
        newProfile.setUserId(user.userId());

        String discriminator = generateDiscriminator(user.username());
        newProfile.setEmail(user.email());
        newProfile.setAvatar(null);
        newProfile.setBio(null);
        newProfile.setStatusPreference(StatusPreference.ONLINE);
        newProfile.setDmPrivacy(DmPrivacy.EVERYONE);
        newProfile.setVersion(1l);

        if (discriminator == null) {
            newProfile.setProfileComplete(false);
            return profileRepository.save(newProfile);
        }

        newProfile.setProfileComplete(true);
        newProfile.setUsername(user.username());
        newProfile.setDiscriminator(generateDiscriminator(user.username()));

        return profileRepository.save(newProfile);
    }

    private String generateDiscriminator(String username) {
        Profile profile = profileRepository.findByUsernameOrderByDiscriminatorDesc(username);

        if (profile == null) {
            return "0001";
        }

        if (profile.getDiscriminator().equals("9999")) {
            return null;
        }

        int number = Integer.parseInt(profile.getDiscriminator());
        number++;

        return String.format("%04d", number);
    }

    public Profile findProfileByUsernameAndDiscriminator(String username, String discriminator) {
        return profileRepository.findByUsernameAndDiscriminator(username, discriminator)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
    }
}
