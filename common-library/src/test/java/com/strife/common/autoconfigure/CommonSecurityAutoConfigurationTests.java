package com.strife.common.autoconfigure;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.boot.test.context.runner.ReactiveWebApplicationContextRunner;
import org.springframework.boot.test.context.runner.WebApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.env.SystemEnvironmentPropertySource;

import com.strife.common.security.JwtAuthenticationEntryPoint;
import com.strife.common.security.JwtAuthenticationFilter;
import com.strife.common.security.JwtProperties;
import com.strife.common.security.JwtUtility;

class CommonSecurityAutoConfigurationTests {

    private static final String SECRET = "jwt.secret=0123456789-0123456789-0123456789-0123456789";

    private final WebApplicationContextRunner servletRunner = new WebApplicationContextRunner()
            .withConfiguration(AutoConfigurations.of(CommonJwtAutoConfiguration.class,
                    CommonSecurityAutoConfiguration.class));

    /**
     * Le point clé pour ne pas dupliquer la config : la variable
     * d'environnement {@code JWT_SECRET} suffit à elle seule. Le binding
     * relâché de Boot la mappe sur {@code jwt.secret}, donc un service
     * consommateur n'a aucun bloc {@code jwt:} à écrire dans son
     * application.yml — et les durées prennent leurs valeurs par défaut.
     */
    @Test
    void isDrivenByTheJwtSecretEnvironmentVariableAlone() {
        servletRunner
                .withInitializer(context -> context.getEnvironment().getPropertySources()
                        .addFirst(new SystemEnvironmentPropertySource(
                                StandardEnvironment.SYSTEM_ENVIRONMENT_PROPERTY_SOURCE_NAME,
                                Map.of("JWT_SECRET", "0123456789-0123456789-0123456789-0123456789"))))
                .run(context -> {
                    assertThat(context).hasSingleBean(JwtAuthenticationFilter.class);

                    JwtProperties properties = context.getBean(JwtProperties.class);
                    assertThat(properties.secret()).isEqualTo("0123456789-0123456789-0123456789-0123456789");
                    assertThat(properties.expiration()).isEqualTo(300_000L);
                    assertThat(properties.refreshToken().expiration()).isEqualTo(604_800L);
                });
    }

    @Test
    void registersFilterAndEntryPointWhenSecretIsSet() {
        servletRunner.withPropertyValues(SECRET).run(context -> {
            assertThat(context).hasSingleBean(JwtAuthenticationFilter.class);
            assertThat(context).hasSingleBean(JwtAuthenticationEntryPoint.class);
        });
    }

    /**
     * Le filtre doit rester hors de la chaîne du conteneur servlet : il n'est
     * exécuté que là où le {@code SecurityFilterChain} le place.
     */
    @Test
    void doesNotRegisterFilterInServletContainer() {
        servletRunner.withPropertyValues(SECRET).run(context -> {
            assertThat(context.getBean(FilterRegistrationBean.class).isEnabled()).isFalse();
        });
    }

    @Test
    void backsOffWithoutSecret() {
        servletRunner.run(context -> {
            assertThat(context).doesNotHaveBean(JwtUtility.class);
            assertThat(context).doesNotHaveBean(JwtAuthenticationFilter.class);
        });
    }

    @Test
    void backsOffOnReactiveApplications() {
        new ReactiveWebApplicationContextRunner()
                .withConfiguration(AutoConfigurations.of(CommonJwtAutoConfiguration.class,
                        CommonSecurityAutoConfiguration.class))
                .withPropertyValues(SECRET)
                .run(context -> assertThat(context).doesNotHaveBean(JwtAuthenticationFilter.class));
    }

    @Test
    void backsOffOnNonWebApplications() {
        new ApplicationContextRunner()
                .withConfiguration(AutoConfigurations.of(CommonJwtAutoConfiguration.class,
                        CommonSecurityAutoConfiguration.class))
                .withPropertyValues(SECRET)
                .run(context -> assertThat(context).doesNotHaveBean(JwtAuthenticationFilter.class));
    }

    @Test
    void serviceCanOverrideTheFilter() {
        servletRunner.withPropertyValues(SECRET)
                .withUserConfiguration(CustomFilterConfiguration.class)
                .run(context -> assertThat(context).getBean(JwtAuthenticationFilter.class)
                        .isSameAs(context.getBean(CustomFilterConfiguration.class).filter));
    }

    @Configuration(proxyBeanMethods = false)
    static class CustomFilterConfiguration {

        private JwtAuthenticationFilter filter;

        @Bean
        JwtAuthenticationFilter jwtAuthenticationFilter(JwtUtility jwtUtility) {
            this.filter = new JwtAuthenticationFilter(jwtUtility);
            return this.filter;
        }
    }
}
