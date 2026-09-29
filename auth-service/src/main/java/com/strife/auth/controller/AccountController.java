package com.strife.auth.controller;

import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strife.auth.dto.ChangePasswordDTO;
import com.strife.auth.dto.ResponseDTO;
import com.strife.auth.dto.TokenDTO;
import com.strife.auth.model.Account;
import com.strife.auth.model.RedisRefreshToken;
import com.strife.auth.service.AccountService;
import com.strife.auth.service.TokenRefreshService;
import com.strife.common.dto.UserDTO;
import com.strife.common.security.JwtPrincipal;
import com.strife.common.security.JwtUtility;

@RestController
@RequestMapping("/api/v1/account")
public class AccountController {

    private final AccountService accountService;

    private final TokenRefreshService tokenRefreshService;

    private final JwtUtility jwtUtility;

    public AccountController(AccountService accountService, TokenRefreshService tokenRefreshService,
            JwtUtility jwtUtility) {
        this.accountService = accountService;
        this.tokenRefreshService = tokenRefreshService;
        this.jwtUtility = jwtUtility;
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseDTO> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO,
            @AuthenticationPrincipal JwtPrincipal authenticatedPrincipal) {
        accountService.changePassword(authenticatedPrincipal.getName(), changePasswordDTO);
        return ResponseEntity.ok(new ResponseDTO("200", "Password changed successfully"));
    }

}
