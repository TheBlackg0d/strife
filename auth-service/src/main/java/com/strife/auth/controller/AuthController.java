package com.strife.auth.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import com.strife.auth.events.AccountEventPublisher;
import com.strife.auth.model.Account;
import com.strife.auth.model.RedisRefreshToken;
import com.strife.common.dto.ResponseDTO;
import com.strife.common.dto.UserDTO;
import com.strife.common.event.AccountRegisteredEvent;
import com.strife.common.security.JwtUtility;
import com.strife.auth.service.AccountService;
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

        private final AccountEventPublisher accountEventPublisher;

        @PostMapping("/login")
        public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO loginDTO, HttpServletResponse response) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password()));
                final UserDetails userDetails = (UserDetails) authentication.getPrincipal();

                String refreshToken = tokenRefreshService.generateRefreshToken(userDetails.getUsername());

                response.addHeader(HttpHeaders.SET_COOKIE,
                                tokenRefreshService.generateRefreshTokenCookie(refreshToken).toString());

                Account account = accountService.getAccountByEmail(userDetails.getUsername());

                UserDTO userDTO = new UserDTO(account.getId(), account.getEmail(), account.getUsername());

                String accessToken = jwtUtility.generateToken(userDetails.getUsername(), userDTO);
                return ResponseEntity.ok(
                                new TokenDTO(accessToken, new AccountDTO(account.getId(), userDetails.getUsername())));
        }

        @PostMapping("/register")
        public ResponseEntity<TokenDTO> register(@Valid @RequestBody RegisterDTO registerDTO,
                        HttpServletResponse response) {
                Account account = accountService.createAccount(registerDTO);

                String refreshToken = tokenRefreshService.generateRefreshToken(account.getEmail());

                UserDTO userDTO = new UserDTO(account.getId(),
                                account.getEmail(), account.getUsername());

                String accessToken = jwtUtility.generateToken(account.getEmail(), userDTO);

                response.addHeader(HttpHeaders.SET_COOKIE,
                                tokenRefreshService.generateRefreshTokenCookie(refreshToken).toString());

                AccountRegisteredEvent accountRegisteredEvent = new AccountRegisteredEvent(account.getId(),
                                account.getUsername(), account.getEmail(), account.getVersion());

                accountEventPublisher.publishAccountRegisteredEvent(accountRegisteredEvent);
                return ResponseEntity
                                .ok(new TokenDTO(accessToken, new AccountDTO(account.getId(), account.getEmail())));
        }

        @PostMapping("refresh-token")
        public ResponseEntity<TokenDTO> refreshToken(HttpServletRequest request, HttpServletResponse response) {

                RedisRefreshToken redisRefreshToken = tokenRefreshService.verifyRefreshToken(request);

                String refreshToken = tokenRefreshService.generateRefreshToken(redisRefreshToken.getEmail());

                ResponseCookie refreshTokenCookie = tokenRefreshService
                                .generateRefreshTokenCookie(refreshToken);

                response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

                String email = redisRefreshToken.getEmail();

                Account account = accountService.getAccountByEmail(email);

                UserDTO userDTO = new UserDTO(account.getId(), account.getEmail(), account.getUsername());

                String token = jwtUtility.generateToken(email, userDTO);
                return ResponseEntity.ok(new TokenDTO(token, new AccountDTO(account.getId(), email)));
        }

        @PostMapping("logout")
        public ResponseEntity<ResponseDTO> logout(HttpServletRequest request, HttpServletResponse response) {
                tokenRefreshService.deleteRefreshToken(request);
                response.addHeader(HttpHeaders.SET_COOKIE, tokenRefreshService.clearRefreshTokenCookie().toString());
                return ResponseEntity.ok(new ResponseDTO(HttpStatus.OK.toString(), "Logged out successfully"));
        }

}
