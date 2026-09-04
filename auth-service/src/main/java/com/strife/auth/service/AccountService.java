package com.strife.auth.service;

import com.strife.auth.repository.AccountRepository;
import com.strife.auth.repository.ProviderRepository;
import com.strife.common.event.ProfileUpdatedEvent;
import com.strife.common.exception.AuthenticationFailedException;
import com.strife.common.exception.RessourceAlreadyExistException;
import com.strife.common.exception.RessourceDoNotMatchException;
import com.strife.common.exception.RessourceNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.strife.auth.dto.ChangePasswordDTO;
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

    public Account getAccountByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new RessourceNotFoundException("Account not found"));
    }

    public Account createAccountFromOAuth2User(String email, String providerType, String providerUserId) {
        Account account = new Account();
        account.setEmail(email);
        account.setUsername(email);
        account.setPasswordHash(null);
        account.setVersion(1L);

        return accountRepository.save(account);
    }

    public void updateAccount(ProfileUpdatedEvent userDTO) {
        Account account = accountRepository.findById(userDTO.userId())
                .orElseThrow(() -> new RessourceNotFoundException("Account not found"));
        account.setEmail(userDTO.email());
        account.setUsername(userDTO.username());
        accountRepository.save(account);
    }

    public Account createAccount(RegisterDTO registerDTO) {
        if (accountRepository.existsByEmail(registerDTO.email())) {
            throw new RessourceAlreadyExistException("Email already exists", "email");
        }

        if (accountRepository.existsByUsername(registerDTO.username())) {
            throw new RessourceAlreadyExistException("Username already exists", "username");
        }

        if (!registerDTO.password().equals(registerDTO.passwordConfirmation())) {
            throw new RessourceDoNotMatchException("Passwords do not match", "password");
        }

        Account account = new Account();
        account.setEmail(registerDTO.email());
        account.setUsername(registerDTO.username());
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

    public void changePassword(String email, ChangePasswordDTO changePasswordDTO) {
        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new com.strife.common.exception.RessourceNotFoundException("Account not found"));

        if (!changePasswordDTO.newPassword().equals(changePasswordDTO.confirmPassword())) {
            throw new RessourceDoNotMatchException("Password do not match", "confirmPassword");
        }

        if (account.getPasswordHash() == null) {
            throw new RessourceNotFoundException("Account has no password");
        }

        if (!encoder.matches(changePasswordDTO.currentPassword(), account.getPasswordHash())) {
            throw new RessourceDoNotMatchException("Current password is incorrect", "currentPassword");
        }

        String hashedNewPassword = encoder.encode(changePasswordDTO.newPassword());
        account.setPasswordHash(hashedNewPassword);

        accountRepository.save(account);
    }
}
