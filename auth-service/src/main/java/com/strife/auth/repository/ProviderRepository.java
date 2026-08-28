package com.strife.auth.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.auth.model.Provider;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Boolean existsByProviderTypeAndAccountId(String name, UUID accountId);

}
