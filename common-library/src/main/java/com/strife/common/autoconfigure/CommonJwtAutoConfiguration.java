package com.strife.common.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import com.strife.common.security.JwtProperties;
import com.strife.common.security.JwtUtility;

import io.jsonwebtoken.Jwts;

/**
 * Expose un {@link JwtUtility} dès que jjwt est sur le classpath et que
 * {@code jwt.secret} est renseigné. Sans secret, pas de bean — un service qui
 * ne touche pas au JWT n'est pas impacté.
 */
@AutoConfiguration
@ConditionalOnClass(Jwts.class)
@ConditionalOnProperty(prefix = "jwt", name = "secret")
@EnableConfigurationProperties(JwtProperties.class)
public class CommonJwtAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    JwtUtility jwtUtility(JwtProperties properties) {
        return new JwtUtility(properties);
    }
}
