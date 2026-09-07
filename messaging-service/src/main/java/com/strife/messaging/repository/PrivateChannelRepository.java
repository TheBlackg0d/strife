package com.strife.messaging.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.messaging.model.PrivateChannel;

public interface PrivateChannelRepository extends JpaRepository<PrivateChannel, UUID> {

    /** Traversée explicite members -> userId (underscore = séparateur de propriété Spring Data). */
    List<PrivateChannel> findByMembers_UserId(UUID userId);
}
