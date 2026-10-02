package com.strife.guild.service;

import com.strife.common.exception.RessourceNotFoundException;
import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.mapper.GuildMapper;
import com.strife.guild.model.Channel;
import com.strife.guild.model.Guild;
import java.util.UUID;
import java.util.List;

import com.strife.guild.repository.GuildRepository;

import org.springframework.stereotype.Service;

@Service
public class GuildService {

    private final GuildRepository guildRepository;

    public GuildService(GuildRepository guildRepository) {
        this.guildRepository = guildRepository;
    }

    public Guild createGuild(GuildCreateRequest request) {
        Guild guild = GuildMapper.toEntity(request);

        Channel defaultChannel = new Channel();
        defaultChannel.setName("general");
        defaultChannel.setGuild(guild);

        guild.getChannels().add(defaultChannel);

        return guildRepository.save(guild);
    }

    public List<Guild> listGuilds() {
        return guildRepository.findAll();
    }

    public Guild getGuildById(UUID id) {
        return guildRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Guild not found"));
    }

}
