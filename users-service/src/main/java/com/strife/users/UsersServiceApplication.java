package com.strife.users;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Profil utilisateur. Voir doc/adr/0010, 0009.
 *
 * Squelette minimal — pas de logique métier. À toi de construire dessus.
 */
@SpringBootApplication
public class UsersServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(UsersServiceApplication.class, args);
    }

}
