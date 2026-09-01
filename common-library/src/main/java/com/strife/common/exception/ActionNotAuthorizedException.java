package com.strife.common.exception;

import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.http.HttpStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class ActionNotAuthorizedException extends RuntimeException {

    public ActionNotAuthorizedException(String message) {
        super(message);
    }
}
