package com.strife.common.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Nécessite spring-security-core sur le classpath du service consommateur.
 */
public class AuthenticationFailedException extends AuthenticationException {

    public AuthenticationFailedException(String message) {
        super(message);
    }
}
