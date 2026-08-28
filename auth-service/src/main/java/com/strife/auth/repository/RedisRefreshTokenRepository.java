package com.strife.auth.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.strife.auth.model.RedisRefreshToken;

public interface RedisRefreshTokenRepository extends CrudRepository<RedisRefreshToken, String> {

    Optional<RedisRefreshToken> findByEmail(String email);

}
