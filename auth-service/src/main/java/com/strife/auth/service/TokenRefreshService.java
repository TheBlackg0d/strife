package com.strife.auth.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.WebUtils;

import com.strife.auth.model.RedisRefreshToken;
import com.strife.auth.repository.RedisRefreshTokenRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

import com.strife.auth.config.CookieProperties;

@Service
public class TokenRefreshService {
    private final RedisRefreshTokenRepository redisRefreshTokenRepository;

    private final CookieProperties cookieProperties;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpirationInSeconds;

    public TokenRefreshService(RedisRefreshTokenRepository redisRefreshTokenRepository,
            CookieProperties cookieProperties) {
        this.redisRefreshTokenRepository = redisRefreshTokenRepository;
        this.cookieProperties = cookieProperties;
    }

    public String generateRefreshToken(String email) {
        redisRefreshTokenRepository.findByEmail(email).ifPresent(redisRefreshTokenRepository::delete);
        String token = UUID.randomUUID().toString();
        redisRefreshTokenRepository.save(new RedisRefreshToken(token, email, refreshTokenExpirationInSeconds));
        return token;
    }

    public RedisRefreshToken getRefreshToken(String refreshToken) {
        return redisRefreshTokenRepository.findById(refreshToken)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not found"));
    }

    public void deleteToken(String tokenString) {
        redisRefreshTokenRepository.deleteById(tokenString);
    }

    public RedisRefreshToken verifyRefreshToken(HttpServletRequest request) {
        Cookie token = WebUtils.getCookie(request, cookieProperties.getName());

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not found");
        }

        return getRefreshToken(token.getValue());
    }

    public ResponseCookie generateRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from(cookieProperties.getName(), refreshToken)
                .httpOnly(cookieProperties.isHttpOnly())
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .path("/")
                .maxAge(cookieProperties.getExpiration())
                .build();
    }

    public ResponseCookie clearRefreshTokenCookie() {
        return ResponseCookie.from(cookieProperties.getName(), "")
                .httpOnly(cookieProperties.isHttpOnly())
                .secure(cookieProperties.isSecure())
                .sameSite(cookieProperties.getSameSite())
                .path("/")
                .maxAge(0)
                .build();
    }

    public void deleteRefreshToken(HttpServletRequest request) {
        Cookie token = WebUtils.getCookie(request, cookieProperties.getName());

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not found");
        }

        this.deleteToken(token.getValue());
    }

}
