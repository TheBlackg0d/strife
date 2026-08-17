package com.strife.gateway.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée HTTP unique, routing + validation JWT centralisée. Voir doc/adr/0012.
 *
 * Squelette minimal — pas de logique métier. À toi de construire dessus.
 */
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

}
