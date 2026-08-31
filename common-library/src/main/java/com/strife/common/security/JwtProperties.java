package com.strife.common.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;


@ConfigurationProperties(prefix = "jwt")
public record JwtProperties(
        String secret,
        @DefaultValue("300000") long expiration,
        @DefaultValue RefreshToken refreshToken) {

    public record RefreshToken(@DefaultValue("604800") long expiration) {
    }
}
