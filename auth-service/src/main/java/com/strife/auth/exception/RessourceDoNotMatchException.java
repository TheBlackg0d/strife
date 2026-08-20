package com.strife.auth.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class RessourceDoNotMatchException extends RuntimeException {

    public RessourceDoNotMatchException(String message) {
        super(message);
    }

}
