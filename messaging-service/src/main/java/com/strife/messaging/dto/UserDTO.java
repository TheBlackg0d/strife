package com.strife.messaging.dto;

import java.util.UUID;

import com.strife.messaging.model.User;

public record UserDTO(UUID id, String username) {

    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getUsername());
    }
}
