package com.strife.auth.service;

import com.strife.auth.repository.AccountRepository;
import com.strife.auth.repository.ProviderRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.strife.auth.exception.RessourceAlreadyExistException;
import com.strife.auth.exception.RessourceDoNotMatchException;
import com.strife.auth.exception.RessourceNotFoundException;

import com.strife.auth.dto.RegisterDTO;
import com.strife.auth.model.Account;
import com.strife.auth.model.Provider;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;

    private final ProviderRepository providerRepository;

    private final PasswordEncoder encoder;

    public boolean existsByEmail(String email) {
        return accountRepository.existsByEmail(email);
    }

    public Account createAccountFromOAuth2User(String email, String providerType, String providerUserId) {
        Account account = new Account();
        account.setEmail(email);
        account.setPasswordHash(null);
        account.setVersion(1L);

        return accountRepository.save(account);
    }

    public Account createAccount(RegisterDTO registerDTO) {
        if (accountRepository.existsByEmail(registerDTO.email())) {
            throw new RessourceAlreadyExistException("Email already exists");
        }

        if (!registerDTO.password().equals(registerDTO.passwordConfirmation())) {
            throw new RessourceDoNotMatchException("Passwords do not match");
        }

        Account account = new Account();
        account.setEmail(registerDTO.email());
        account.setPasswordHash(
                encoder.encode(registerDTO.password()));
        account.setVersion(1L);

        return accountRepository.save(account);
    }

    public void addProviderToAccount(String email, String providerType, String providerUserId) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNotFoundException("Account not found"));
        if (this.providerRepository.existsByProviderTypeAndAccountId(providerType, account.getId())) {
            return;
        }

        Provider provider = new Provider();
        provider.setProviderType(providerType);
        provider.setProviderUserId(providerUserId);
        provider.setAccount(account);

        this.providerRepository.save(provider);

    }
}
