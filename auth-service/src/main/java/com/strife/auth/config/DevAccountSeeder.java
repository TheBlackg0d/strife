package com.strife.auth.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import com.strife.auth.dto.RegisterDTO;
import com.strife.auth.events.AccountEventPublisher;
import com.strife.auth.model.Account;
import com.strife.auth.service.AccountService;
import com.strife.common.event.auth.AccountRegisteredEvent;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(name = "strife.seed.enabled", havingValue = "true")
@AllArgsConstructor
@Slf4j
public class DevAccountSeeder implements CommandLineRunner {

    private static final String SEED_PASSWORD = "Password123!";

    private static final String EMAIL_DOMAIN = "@strife.test";

    private static final List<String> SEED_USERNAMES = List.of(
            "theblackg0d",
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

    private AccountEventPublisher accountEventPublisher;

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

            AccountRegisteredEvent event = new AccountRegisteredEvent(
                    account.getId(),
                    account.getUsername(),
                    account.getEmail(),
                    account.getVersion());

            accountEventPublisher.publishAccountRegisteredEvent(event);

            log.debug("Compte de dev créé : {} ({})", account.getUsername(), account.getId());
            created++;
        }

        log.info("Seed de dev : {} compte(s) créé(s) sur {}.", created, SEED_USERNAMES.size());
    }
}
