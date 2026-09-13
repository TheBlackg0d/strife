package com.strife.common.file;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "file.url")
public record FileUrlProperties(
        String signingKey,
        @DefaultValue("/api/v1/files") String baseUrl,
        @DefaultValue("15m") Duration ttl,
        @DefaultValue("5m") Duration bucket) {
}
