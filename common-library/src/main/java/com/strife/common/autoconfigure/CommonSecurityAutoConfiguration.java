package com.strife.common.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;

import com.strife.common.security.JwtAuthenticationEntryPoint;
import com.strife.common.security.JwtAuthenticationFilter;
import com.strife.common.security.JwtUtility;

/**
 * Expose le filtre JWT commun dès qu'un {@link JwtUtility} existe (donc dès que
 * {@code jwt.secret} est renseigné) et que Spring Security servlet est sur le
 * classpath.
 *
 * <p>
 * Conditionnée à {@code Type.SERVLET} : api-gateway tourne en WebFlux, un
 * {@link jakarta.servlet.Filter} n'y a pas sa place.
 *
 * <p>
 * Le filtre n'est qu'une brique : il pose l'authentification quand un token
 * valide est présent, mais c'est au {@code SecurityFilterChain} de chaque
 * service de protéger ses routes.
 */
@AutoConfiguration(after = CommonJwtAutoConfiguration.class)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass({ SecurityContextHolder.class, AuthenticationEntryPoint.class })
@ConditionalOnBean(JwtUtility.class)
public class CommonSecurityAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtility jwtUtility) {
        return new JwtAuthenticationFilter(jwtUtility);
    }

    @Bean
    FilterRegistrationBean<JwtAuthenticationFilter> jwtAuthenticationFilterRegistration(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(
                jwtAuthenticationFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    @ConditionalOnMissingBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }
}
