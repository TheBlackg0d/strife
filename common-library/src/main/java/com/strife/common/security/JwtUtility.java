package com.strife.common.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import com.strife.common.dto.UserDTO;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Slf4j
public class JwtUtility {

    private final SecretKey key;
    private final long expirationMs;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtUtility(JwtProperties properties) {
        this(properties.secret(), properties.expiration());
    }

    public JwtUtility(String secret, long expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String email, UserDTO user) {
        log.info("Generating token for user: {}", user);

        Map<String, Object> claims = objectMapper.convertValue(user, new TypeReference<Map<String, Object>>() {
        });

        Date now = new Date();

        return Jwts.builder()
                .subject(email)
                .claim("user", claims)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key, Jwts.SIG.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public UserDTO getUserFromToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token)
                .getPayload();
        return objectMapper.convertValue(claims.get("user"), UserDTO.class);
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }
}
