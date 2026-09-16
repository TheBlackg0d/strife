package com.strife.users.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import com.strife.common.event.Profile.RelationshipChangeEvent;
import com.strife.users.dto.RelationshipDTO;
import com.strife.users.event.EventRoutingKey;
import com.strife.users.event.publisher.RelationshipPublisher;
import com.strife.users.model.Profile;
import com.strife.users.repository.ProfileRepository;
import com.strife.users.repository.RelationshipRepository;
import com.strife.users.service.RelationshipService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@ConditionalOnProperty(name = "strife.seed.enabled", havingValue = "true")
@AllArgsConstructor
@Slf4j
public class DevRelationshipSeeder implements CommandLineRunner {

    private record SeedRelation(String initiator, String target, boolean accepted) {
    }

    private record SeedEvent(EventRoutingKey key, RelationshipChangeEvent event) {
    }

    private static final List<SeedRelation> SEED_RELATIONS = List.of(
            new SeedRelation("theblackg0d", "dev", true),
            new SeedRelation("theblackg0d", "lunarfox", true),
            new SeedRelation("theblackg0d", "pixelmancer", true),
            new SeedRelation("theblackg0d", "cinderbyte", true),
            new SeedRelation("dev", "lunarfox", true),
            new SeedRelation("dev", "pixelmancer", true),
            new SeedRelation("lunarfox", "velvetotter", true),
            new SeedRelation("quietstorm", "theblackg0d", false),
            new SeedRelation("nova_kade", "theblackg0d", false),
            new SeedRelation("theblackg0d", "amberlynx", false));

    private final ProfileRepository profileRepository;

    private final RelationshipRepository relationshipRepository;

    private final RelationshipService relationshipService;

    private final RelationshipPublisher relationshipPublisher;

    private final TransactionTemplate transactionTemplate;

    @Override
    public void run(String... args) {
        int created = 0;

        for (SeedRelation seed : SEED_RELATIONS) {
            List<SeedEvent> events = transactionTemplate.execute(status -> seedRelation(seed));

            if (events == null || events.isEmpty()) {
                continue;
            }

            events.forEach(e -> relationshipPublisher.publishFriendChangeEvent(e.key(), e.event()));
            created++;
        }

        log.info("Seed de dev : {} relation(s) créée(s) sur {}.", created, SEED_RELATIONS.size());
    }

    private List<SeedEvent> seedRelation(SeedRelation seed) {
        Optional<Profile> initiator = profileRepository.findByUsername(seed.initiator());
        Optional<Profile> target = profileRepository.findByUsername(seed.target());

        if (initiator.isEmpty() || target.isEmpty()) {
            log.warn("Seed de dev : profil manquant pour {} -> {}, relation ignorée.", seed.initiator(),
                    seed.target());
            return List.of();
        }

        if (relationshipRepository.findByProfilePair(initiator.get().getUserId(), target.get().getUserId())
                .isPresent()) {
            return List.of();
        }

        List<SeedEvent> events = new ArrayList<>();

        RelationshipDTO sent = relationshipService.sendFriendRequest(initiator.get(), target.get());
        events.add(new SeedEvent(EventRoutingKey.RELATIONSHIP_SENT,
                new RelationshipChangeEvent(initiator.get().getUserId(), target.get().getUserId(), sent.status())));

        if (seed.accepted()) {
            RelationshipDTO accepted = relationshipService.acceptFriendRequest(target.get(), initiator.get());
            events.add(new SeedEvent(EventRoutingKey.RELATIONSHIP_ADDED,
                    new RelationshipChangeEvent(target.get().getUserId(), initiator.get().getUserId(),
                            accepted.status())));
        }

        return events;
    }
}
