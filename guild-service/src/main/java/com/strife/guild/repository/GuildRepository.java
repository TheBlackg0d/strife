package com.strife.guild.repository;

import com.strife.guild.model.Guild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface GuildRepository extends JpaRepository<Guild, UUID> {

    @Query("select g from Guild g join g.members m where m.userId = :userId")
    List<Guild> findAllByMemberUserId(@Param("userId") UUID userId);

    boolean existsByIdAndMembersUserId(UUID id, UUID userId);
}
