package com.strife.auth.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.strife.auth.dto.RegisterDTO;
import com.strife.auth.model.Account;
import com.strife.auth.service.AccountService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Jeu de comptes de dev, créé au démarrage en passant par
 * {@link AccountService#createAccount(RegisterDTO)} — donc par le même chemin
 * qu'une inscription réelle, contrairement aux {@code INSERT} Liquibase qu'il
 * remplace. C'est ce qui permettra de publier {@code auth.account.registered}
 * sur ces comptes le jour où l'event sera branché (ADR-0014).
 *
 * <p>
 * Inactif par défaut : activer avec {@code STRIFE_SEED_ENABLED=true}. Le runner
 * est idempotent, il ignore les comptes dont l'email existe déjà.
 */
@Component
@ConditionalOnProperty(name = "strife.seed.enabled", havingValue = "true")
@AllArgsConstructor
@Slf4j
public class DevAccountSeeder implements CommandLineRunner {

    /** Mot de passe commun à tous les comptes de dev. */
    private static final String SEED_PASSWORD = "Password123!";

    private static final String EMAIL_DOMAIN = "@strife.test";

    private static final List<String> SEED_USERNAMES = List.of(
            "dev",
            "lunarfox",
            "pixelmancer",
            "quietstorm",
            "cinderbyte",
            "velvetotter",
            "nova_kade",
            "amberlynx",
            "tidalward",
            "frostquill",
            "hollowmaple",
            "solarnomad",
            "crimsonharbor",
            "silentbadger",
            "neonthistle",
            "rogue_ember",
            "wiredorchid",
            "mistybison",
            "goldenvulture",
            "arcticdrifter",
            "feralbeacon");

    private final AccountService accountService;

    @Override
    public void run(String... args) {
        int created = 0;

        for (String username : SEED_USERNAMES) {
            String email = username + EMAIL_DOMAIN;

            if (accountService.existsByEmail(email)) {
                continue;
            }

            Account account = accountService.createAccount(
                    new RegisterDTO(email, SEED_PASSWORD, SEED_PASSWORD, username));

            log.debug("Compte de dev créé : {} ({})", account.getUsername(), account.getId());
            created++;
        }

        log.info("Seed de dev : {} compte(s) créé(s) sur {}.", created, SEED_USERNAMES.size());
    }
}
