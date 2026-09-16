package com.strife.messaging.config;

import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.strife.messaging.dto.GroupDmRequest;
import com.strife.messaging.dto.MessageRequest;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.Message;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.MessageRepository;
import com.strife.messaging.repository.UserRepository;
import com.strife.messaging.service.ChannelService;
import com.strife.messaging.service.MessageService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(name = "strife.seed.enabled", havingValue = "true")
@AllArgsConstructor
@Slf4j
public class DevMessagingSeeder implements CommandLineRunner {

    private record SeedLine(String sender, String content) {
    }

    private record SeedDm(String first, String second, List<SeedLine> lines) {
    }

    private record SeedGroup(String name, String owner, List<String> members, List<SeedLine> lines) {
    }

    private static final String MARKER_USER = "theblackg0d";

    private static final Duration MESSAGE_GAP = Duration.ofMinutes(3);

    private static final List<SeedDm> SEED_DMS = List.of(
            new SeedDm("theblackg0d", "dev", List.of(
                    new SeedLine("theblackg0d", "yo, t'es là ?"),
                    new SeedLine("dev", "ouais, je teste l'édition de messages"),
                    new SeedLine("theblackg0d", "ça marche de ton côté ?"),
                    new SeedLine("dev", "nickel, les emojis aussi 🔥"),
                    new SeedLine("theblackg0d", "parfait, je m'attaque aux pièces jointes"))),
            new SeedDm("theblackg0d", "lunarfox", List.of(
                    new SeedLine("lunarfox", "salut !"),
                    new SeedLine("theblackg0d", "hey, ça va ?"),
                    new SeedLine("lunarfox", "tranquille, tu joues ce soir ?"))),
            new SeedDm("dev", "pixelmancer", List.of(
                    new SeedLine("pixelmancer", "t'as vu la nouvelle maquette ?"),
                    new SeedLine("dev", "pas encore, envoie"))));

    private static final List<SeedGroup> SEED_GROUPS = List.of(
            new SeedGroup("Strife devs", "theblackg0d", List.of("dev", "lunarfox", "pixelmancer"), List.of(
                    new SeedLine("theblackg0d", "bienvenue dans le groupe"),
                    new SeedLine("dev", "merci !"),
                    new SeedLine("pixelmancer", "qui review ma PR ?"),
                    new SeedLine("lunarfox", "je regarde ça"))),
            new SeedGroup("Soirée jeux", "lunarfox", List.of("theblackg0d", "velvetotter", "cinderbyte"), List.of(
                    new SeedLine("lunarfox", "21h ce soir ?"),
                    new SeedLine("cinderbyte", "ok pour moi"),
                    new SeedLine("velvetotter", "je serai un peu en retard"))));

    private final UserRepository userRepository;

    private final ChannelService channelService;

    private final MessageService messageService;

    private final MessageRepository messageRepository;

    @Override
    @Transactional
    public void run(String... args) {
        Map<String, User> users = loadSeedUsers();

        if (!users.containsKey(MARKER_USER)) {
            log.warn("Seed de dev : utilisateurs pas encore répliqués, seed messaging ignoré.");
            return;
        }

        if (!channelService.getPrivateChannels(users.get(MARKER_USER).getId()).isEmpty()) {
            log.info("Seed de dev : channels déjà présents pour {}, seed messaging ignoré.", MARKER_USER);
            return;
        }

        int channels = 0;

        for (SeedDm seed : SEED_DMS) {
            User first = users.get(seed.first());
            User second = users.get(seed.second());

            if (first == null || second == null) {
                log.warn("Seed de dev : utilisateur manquant pour le DM {} / {}.", seed.first(), seed.second());
                continue;
            }

            Channel dm = channelService.createDm(first, second);
            seedMessages(dm, seed.lines(), users);
            channels++;
        }

        for (SeedGroup seed : SEED_GROUPS) {
            User owner = users.get(seed.owner());
            Set<UUID> members = seed.members().stream()
                    .map(users::get)
                    .filter(user -> user != null)
                    .map(User::getId)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            if (owner == null || members.size() + 1 < Channel.MIN_GROUP_MEMBERS) {
                log.warn("Seed de dev : pas assez de membres pour le groupe {}.", seed.name());
                continue;
            }

            Channel group = channelService.createGroupDm(new GroupDmRequest(seed.name(), members), owner.getId());
            seedMessages(group, seed.lines(), users);
            channels++;
        }

        log.info("Seed de dev : {} channel(s) créé(s).", channels);
    }

    private Map<String, User> loadSeedUsers() {
        Set<String> usernames = new LinkedHashSet<>();
        usernames.add(MARKER_USER);
        SEED_DMS.forEach(dm -> {
            usernames.add(dm.first());
            usernames.add(dm.second());
        });
        SEED_GROUPS.forEach(group -> {
            usernames.add(group.owner());
            usernames.addAll(group.members());
        });

        return usernames.stream()
                .map(userRepository::findByUsername)
                .flatMap(Optional::stream)
                .collect(Collectors.toMap(User::getUsername, user -> user));
    }

    private void seedMessages(Channel channel, List<SeedLine> lines, Map<String, User> users) {
        Instant start = Instant.now().minus(MESSAGE_GAP.multipliedBy(lines.size()));

        for (int i = 0; i < lines.size(); i++) {
            SeedLine line = lines.get(i);
            User sender = users.get(line.sender());

            if (sender == null) {
                continue;
            }

            Message message = messageService.createMessage(
                    new MessageRequest(channel.getId(), line.content(), List.of()), channel, sender);
            message.setTimestamp(start.plus(MESSAGE_GAP.multipliedBy(i)));
            messageRepository.save(message);
        }
    }
}
