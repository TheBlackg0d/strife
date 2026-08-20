package com.strife.auth.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.strife.auth.model.RedisRefreshToken;
import com.strife.auth.repository.RedisRefreshTokenRepository;
import com.strife.auth.exception.RessourceNotFoundException;

@Service
public class TokenRefreshService {
    private final RedisRefreshTokenRepository redisRefreshTokenRepository;

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenExpirationInSeconds;

    public TokenRefreshService(RedisRefreshTokenRepository redisRefreshTokenRepository) {
        this.redisRefreshTokenRepository = redisRefreshTokenRepository;
    }

    public String generateRefreshToken(String email) {
        redisRefreshTokenRepository.findByEmail(email).ifPresent(redisRefreshTokenRepository::delete);
        String token = UUID.randomUUID().toString();
        redisRefreshTokenRepository.save(new RedisRefreshToken(token, email, refreshTokenExpirationInSeconds));
        return token;
    }

    public RedisRefreshToken getRefreshToken(String refreshToken) {
        return redisRefreshTokenRepository.findById(refreshToken)
                .orElseThrow(() -> new RessourceNotFoundException("Refresh token not found"));
    }

    public void deleteToken(String tokenString) {
        redisRefreshTokenRepository.deleteById(tokenString);
    }

}
