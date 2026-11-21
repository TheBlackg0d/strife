package com.strife.guild.service;

import com.strife.common.dto.UserDTO;
import com.strife.common.event.guild.ChannelCreatedEvent;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.security.JwtPrincipal;
import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.event.EventRoutingKey;
import com.strife.guild.event.publisher.ChannelPublisher;
import com.strife.guild.mapper.GuildMapper;
import com.strife.guild.mapper.UserMapper;
import com.strife.guild.model.Channel;
import com.strife.guild.model.ChannelType;
import com.strife.guild.model.Guild;
import com.strife.guild.model.Member;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

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

    public Guild createGuild(GuildCreateRequest request, JwtPrincipal creator) {
        Guild guild = GuildMapper.toEntity(request, creator.id());

        addMember(guild, new Member(creator.id(), creator.username()));
        Optional.ofNullable(request.members()).orElse(List.of()).stream()
                .filter(member -> member != null && member.id() != null)
                .filter(member -> guild.getMembers().stream().noneMatch(m -> m.getUserId().equals(member.id())))
                .forEach(member -> addMember(guild, UserMapper.toEntity(member)));

        Channel defaultChannel = new Channel();
        defaultChannel.setName("general");
        defaultChannel.setChannelType(ChannelType.TEXT);
        defaultChannel.setGuild(guild);

        guild.getChannels().add(defaultChannel);

        Guild saved = guildRepository.save(guild);

        saved.getChannels().forEach(channel -> publishChannelCreated(saved, channel));

        return saved;
    }

    public List<Guild> listGuilds(UUID userId) {
        return guildRepository.findAllByMemberUserId(userId);
    }

    public Guild getGuildById(UUID id, UUID userId) {
        Guild guild = guildRepository.findById(id).orElseThrow(() -> new RessourceNotFoundException("Guild not found"));
        if (!guildRepository.existsByIdAndMembersUserId(id, userId)) {
            throw new ActionNotAuthorizedException("You are not a member of this guild.");
        }
        return guild;
    }

    private void addMember(Guild guild, Member member) {
        member.setGuild(guild);
        guild.getMembers().add(member);
    }

    private void publishChannelCreated(Guild guild, Channel channel) {
        List<UserDTO> members = guild.getMembers().stream()
                .map(member -> new UserDTO(member.getUserId(), null, member.getUsername()))
                .toList();

        channelPublisher.sendChannelEvent(EventRoutingKey.CHANNEL_CREATED,
                new ChannelCreatedEvent(channel.getId(), channel.getName(), guild.getId(), members));
    }

}
