package com.strife.messaging.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.messaging.model.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {

    Optional<Reaction> findByMessageIdAndUserIdAndEmoji(UUID messageId, UUID userId, String emoji);
}
