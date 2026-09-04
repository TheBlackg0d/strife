package com.strife.auth.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.auth.dto.ChangePasswordDTO;
import com.strife.auth.dto.ResponseDTO;
import com.strife.auth.service.AccountService;
import com.strife.common.security.JwtPrincipal;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseDTO> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO,
            @AuthenticationPrincipal JwtPrincipal authenticatedPrincipal) {
        accountService.changePassword(authenticatedPrincipal.getName(), changePasswordDTO);
        return ResponseEntity.ok(new ResponseDTO("200", "Password changed successfully"));
    }

}
