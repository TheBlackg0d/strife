package com.strife.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Authentification — inscription, login, JWT, OAuth2 client (Google/Facebook). Voir doc/adr/0010, 0011, 0014.
 *
 * Squelette minimal — pas de logique métier. À toi de construire dessus.
 */
@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

}
