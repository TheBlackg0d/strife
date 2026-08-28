package com.strife.auth.dto;

import java.util.UUID;

import com.strife.auth.model.Account;

public record UserDTO(UUID userId, String username, String email, Long version) {

    public static UserDTO fromEntity(Account account, String username) {
        return new UserDTO(account.getId(), username, account.getEmail(), account.getVersion());
    }
}
