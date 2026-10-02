package com.strife.guild.repository;

import com.strife.guild.model.Guild;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface GuildRepository extends JpaRepository<Guild, UUID> {

}
