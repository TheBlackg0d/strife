package com.strife.auth.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.strife.auth.dto.AccountDTO;
import com.strife.auth.dto.LoginDTO;
import com.strife.auth.dto.RegisterDTO;
import com.strife.auth.dto.TokenDTO;
import com.strife.auth.dto.UserDTO;
import com.strife.auth.model.Account;
import com.strife.auth.model.RedisRefreshToken;
import com.strife.auth.security.JwtUtility;
import com.strife.auth.service.AccountService;
import com.strife.auth.service.MessageService;
import com.strife.auth.service.TokenRefreshService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@Validated
public class AuthController {

        private final AuthenticationManager authenticationManager;

        private final AccountService accountService;

        private final TokenRefreshService tokenRefreshService;

        private final JwtUtility jwtUtility;

        private final MessageService messageService;

        private static final String ACCOUNT_CREATED_EVENT_ROUTING_KEY = "auth.account.created";

        @PostMapping("/login")
        public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO loginDTO, HttpServletResponse response) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password()));
                final UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                String refreshToken = tokenRefreshService.generateRefreshToken(userDetails.getUsername());
                String accessToken = jwtUtility.generateToken(userDetails.getUsername());

                response.addHeader(HttpHeaders.SET_COOKIE,
                                tokenRefreshService.generateRefreshTokenCookie(refreshToken).toString());

                Account account = accountService.getAccountByEmail(userDetails.getUsername());
                return ResponseEntity.ok(
                                new TokenDTO(accessToken, new AccountDTO(account.getId(), userDetails.getUsername())));
        }

        @PostMapping("/register")
        public ResponseEntity<TokenDTO> register(@Valid @RequestBody RegisterDTO registerDTO,
                        HttpServletResponse response) {
                Account account = accountService.createAccount(registerDTO);

                String refreshToken = tokenRefreshService.generateRefreshToken(account.getEmail());
                String accessToken = jwtUtility.generateToken(account.getEmail());

                response.addHeader(HttpHeaders.SET_COOKIE,
                                tokenRefreshService.generateRefreshTokenCookie(refreshToken).toString());

                messageService.sendMessage(UserDTO.fromEntity(account, registerDTO.username()),
                                ACCOUNT_CREATED_EVENT_ROUTING_KEY);
                return ResponseEntity
                                .ok(new TokenDTO(accessToken, new AccountDTO(account.getId(), account.getEmail())));
        }

        @PostMapping("refresh-token")
        public ResponseEntity<TokenDTO> refreshToken(HttpServletRequest request, HttpServletResponse response) {

                RedisRefreshToken redisRefreshToken = tokenRefreshService.verifyRefreshToken(request);

                ResponseCookie refreshTokenCookie = tokenRefreshService
                                .generateRefreshTokenCookie(redisRefreshToken.getToken());

                response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                String email = redisRefreshToken.getEmail();

                String token = jwtUtility.generateToken(email);

                Account account = accountService.getAccountByEmail(email);

                return ResponseEntity.ok(new TokenDTO(token, new AccountDTO(account.getId(), email)));
        }

}
