package com.strife.eventstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Historique append-only de tous les events du système. Voir doc/adr/0004, 0007.
 *
 * Squelette minimal — pas de logique métier. À toi de construire dessus.
 */
@SpringBootApplication
public class EventStoreServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EventStoreServiceApplication.class, args);
    }

}
