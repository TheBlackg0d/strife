package com.strife.common.dto;

import java.util.UUID;

public record UserDTO(UUID id, String email, String username) {

}
