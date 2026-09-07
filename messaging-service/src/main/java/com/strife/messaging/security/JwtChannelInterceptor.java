package com.strife.messaging.security;

import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.strife.common.security.JwtUtility;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class JwtChannelInterceptor implements ChannelInterceptor {

    private final JwtUtility jwtUtility;

}
