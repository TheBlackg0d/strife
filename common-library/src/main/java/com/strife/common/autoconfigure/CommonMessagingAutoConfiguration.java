package com.strife.common.autoconfigure;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.amqp.autoconfigure.RabbitAutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;

import com.strife.common.services.MessageService;

/**
 * Expose un {@link MessageService} dès qu'un {@link RabbitTemplate} existe.
 *
 * <p>
 * Les classes de la bibliothèque vivent dans {@code com.strife.common}, hors du
 * scan de composants des services ({@code com.strife.auth},
 * {@code com.strife.users}, …) : elles doivent donc être enregistrées ici et
 * non via une annotation de stéréotype.
 */
@AutoConfiguration(after = RabbitAutoConfiguration.class)
@ConditionalOnClass(RabbitTemplate.class)
public class CommonMessagingAutoConfiguration {

    @Bean
    @ConditionalOnBean(RabbitTemplate.class)
    @ConditionalOnMissingBean
    MessageService messageService(RabbitTemplate rabbitTemplate) {
        return new MessageService(rabbitTemplate);
    }
}
