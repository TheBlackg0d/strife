package com.strife.auth.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@RedisHash("refresh_tokens")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RedisRefreshToken implements Serializable {

    @Id
    private String token;

    @Indexed
    private String email;

    @TimeToLive
    private Long ttlInSeconds;
}
