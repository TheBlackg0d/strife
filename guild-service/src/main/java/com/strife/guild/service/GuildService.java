package com.strife.guild.service;

import com.strife.common.dto.UserDTO;
import com.strife.common.event.guild.ChannelCreatedEvent;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.event.EventRoutingKey;
import com.strife.guild.event.publisher.ChannelPublisher;
import com.strife.guild.mapper.GuildMapper;
import com.strife.guild.model.Channel;
import com.strife.guild.model.ChannelType;
import com.strife.guild.model.Guild;
import java.util.UUID;
import java.util.List;

import com.strife.guild.repository.GuildRepository;

import org.springframework.stereotype.Service;

@Service
public class GuildService {

    private final GuildRepository guildRepository;

    private final ChannelPublisher channelPublisher;

    public GuildService(GuildRepository guildRepository, ChannelPublisher channelPublisher) {
        this.guildRepository = guildRepository;
        this.channelPublisher = channelPublisher;
    }

    public Guild createGuild(GuildCreateRequest request) {
        Guild guild = GuildMapper.toEntity(request);

        Channel defaultChannel = new Channel();
        defaultChannel.setName("general");
        defaultChannel.setChannelType(ChannelType.TEXT);
        defaultChannel.setGuild(guild);

        guild.getChannels().add(defaultChannel);

        Guild saved = guildRepository.save(guild);

        saved.getChannels().forEach(channel -> publishChannelCreated(saved, channel));

        return saved;
    }

    public List<Guild> listGuilds() {
        return guildRepository.findAll();
    }

    public Guild getGuildById(UUID id) {
        return guildRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Guild not found"));
    }

    private void publishChannelCreated(Guild guild, Channel channel) {
        List<UserDTO> members = guild.getMembers().stream()
                .map(member -> new UserDTO(member.getUserId(), null, member.getUsername()))
                .toList();

        channelPublisher.sendChannelEvent(EventRoutingKey.CHANNEL_CREATED,
                new ChannelCreatedEvent(channel.getId(), channel.getName(), guild.getId(), members));
    }

}
