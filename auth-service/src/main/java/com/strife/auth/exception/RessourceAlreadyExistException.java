package com.strife.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class RessourceAlreadyExistException extends RuntimeException {

    public RessourceAlreadyExistException(String message) {
        super(message);
    }
}
