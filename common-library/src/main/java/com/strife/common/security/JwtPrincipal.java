package com.strife.common.security;

import java.util.UUID;

import org.springframework.security.core.AuthenticatedPrincipal;

public record JwtPrincipal(UUID id, String email, String username) implements AuthenticatedPrincipal {

    @Override
    public String getName() {
        return email;
    }
}
