package com.strife.auth.controller;

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

import com.strife.auth.dto.ChangePasswordDTO;
import com.strife.auth.dto.LoginDTO;
import com.strife.auth.dto.RegisterDTO;
import com.strife.auth.dto.ResponseDTO;
import com.strife.auth.dto.TokenDTO;
import com.strife.auth.model.RedisRefreshToken;
import com.strife.auth.security.JwtUtility;
import com.strife.auth.service.AccountService;
import com.strife.auth.service.TokenRefreshService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@Validated
public class AuthController {

    private AuthenticationManager authenticationManager;
    private final AccountService accountService;

    private final TokenRefreshService tokenRefreshService;

    private final JwtUtility jwtUtility;

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDTO.email(), loginDTO.password()));
        final UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String refreshToken = tokenRefreshService.generateRefreshToken(userDetails.getUsername());
        String accessToken = jwtUtility.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new TokenDTO(accessToken, refreshToken));
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@Valid @RequestBody RegisterDTO registerDTO) {
        accountService.createAccount(registerDTO);
        return ResponseEntity.ok(new ResponseDTO("200", "Account created successfully"));
    }

    @PostMapping("refresh-token")
    public ResponseEntity<String> refreshToken(@RequestBody String refreshToken) {

        RedisRefreshToken redisRefreshToken = tokenRefreshService.getRefreshToken(refreshToken);

        return ResponseEntity.ok(jwtUtility.generateToken(redisRefreshToken.getEmail()));
    }

}
