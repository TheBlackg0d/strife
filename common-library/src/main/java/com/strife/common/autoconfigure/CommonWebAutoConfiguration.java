package com.strife.common.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication.Type;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.strife.common.exception.GlobalExceptionHandler;
import com.strife.common.exception.SecurityExceptionHandler;

/**
 * Enregistre les handlers d'exceptions communs dans les services servlet.
 *
 * <p>
 * Conditionnée à {@code Type.SERVLET} : api-gateway tourne en WebFlux, un
 * {@code @ControllerAdvice} servlet n'y a pas sa place.
 *
 * <p>
 * Un service qui veut son propre comportement peut définir un bean du même
 * type (ou une sous-classe) : {@code @ConditionalOnMissingBean} le laisse
 * gagner.
 */
@AutoConfiguration
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass(ResponseEntityExceptionHandler.class)
public class CommonWebAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    GlobalExceptionHandler globalExceptionHandler() {
        return new GlobalExceptionHandler();
    }

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass(AuthenticationException.class)
    static class SecurityExceptionHandlerConfiguration {

        @Bean
        @ConditionalOnMissingBean
        SecurityExceptionHandler securityExceptionHandler() {
            return new SecurityExceptionHandler();
        }
    }
}
