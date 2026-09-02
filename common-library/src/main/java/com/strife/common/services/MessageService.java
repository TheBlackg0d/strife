package com.strife.common.services;

import org.springframework.amqp.rabbit.core.RabbitTemplate;

/**
 * Publication d'events AMQP. Enregistré par
 * {@code CommonMessagingAutoConfiguration} — pas de stéréotype ici, le package
 * {@code com.strife.common} est hors du scan des services.
 */
public class MessageService {

    private final RabbitTemplate rabbitTemplate;

    public MessageService(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public <T> void sendMessage(T message, String routingKey, String exchange) {
        rabbitTemplate.convertAndSend(exchange, routingKey, message);
    }
}
