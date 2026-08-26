package com.strife.auth.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "cookie")
@Getter
@Setter
@Component
public class CookieProperties {

    private boolean secure;
    private boolean httpOnly;
    private String sameSite;
    private String name;
    private int expiration;
}
