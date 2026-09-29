package com.strife.messaging.dto;

import java.util.UUID;

import com.strife.messaging.model.User;
import com.strife.common.security.JwtPrincipal;

public record UserDTO(UUID id, String username) {

    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getUsername());
    }

    public static UserDTO from(JwtPrincipal principal) {
        return new UserDTO(principal.id(), principal.username());
    }
}
