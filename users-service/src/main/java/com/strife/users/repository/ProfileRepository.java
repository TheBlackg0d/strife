package com.strife.users.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.users.model.Profile;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    Profile findByUsernameOrderByDiscriminatorDesc(String username);

}
