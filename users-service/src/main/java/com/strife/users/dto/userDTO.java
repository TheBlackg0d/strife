package com.strife.users.dto;

import java.util.UUID;

public record userDTO(UUID userId, String username, String email, Long version) {

}
