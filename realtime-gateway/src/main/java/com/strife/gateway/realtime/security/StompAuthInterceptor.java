package com.strife.gateway.realtime.security;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import com.strife.common.dto.UserDTO;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.security.JwtPrincipal;
import com.strife.common.security.JwtUtility;

import io.jsonwebtoken.lang.Collections;

import java.util.Collection;

import org.springframework.http.HttpHeaders;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompAuthInterceptor implements ChannelInterceptor {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtUtility jwtUtility;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null || accessor.getCommand() == null) {
            return message;
        }

        if (StompCommand.SEND.equals(accessor.getCommand())) {
            log.warn("SEND blocked to {}", accessor.getDestination());
            throw new ActionNotAuthorizedException("Real time gateway is read only");
        }

        if (!StompCommand.CONNECT.equals(accessor.getCommand())) {
            return message;
        }

        String header = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);

        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new ActionNotAuthorizedException("Missing or invalid Authorization header");
        }

        try {

            UserDTO user = jwtUtility.getUserFromToken(header.substring(BEARER_PREFIX.length()));

            if (user == null) {
                throw new RessourceNotFoundException("No user found");
            }

            JwtPrincipal principal = new JwtPrincipal(user.id(), user.email(), user.username());
            accessor.setUser(new UsernamePasswordAuthenticationToken(principal, null, Collections.emptyList()));

            log.info("Stomp session authenticated {}", principal.email());
        } catch (RessourceNotFoundException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Error while authenticating stomp session", exception);
            throw new ActionNotAuthorizedException("Invalid token");
        }

        return message;
    }
}
