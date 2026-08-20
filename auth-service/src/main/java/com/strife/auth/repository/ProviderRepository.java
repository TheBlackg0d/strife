package com.strife.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.auth.model.Provider;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    Boolean existsByProviderTypeAndAccountId(String name, String accountId);

}
