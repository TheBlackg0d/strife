package com.strife.gateway.realtime;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Connexions WebSocket, diffusion temps réel, presence via Redis. Voir doc/adr/0009, 0012.
 *
 * Squelette minimal — pas de logique métier. À toi de construire dessus.
 */
@SpringBootApplication
public class RealtimeGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(RealtimeGatewayApplication.class, args);
    }

}
