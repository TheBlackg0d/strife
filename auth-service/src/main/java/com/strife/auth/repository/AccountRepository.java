package com.strife.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.auth.model.Account;

public interface AccountRepository extends JpaRepository<Account, UUID> {

    Optional<Account> findByEmail(String email);

    Boolean existsByEmail(String email);

    Boolean existsByUsername(String username);
}
