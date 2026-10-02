package com.strife.guild.dto;

import java.util.List;
import java.util.UUID;

import com.strife.guild.model.Guild;

public record GuildDetailDTO(UUID id, String name, String guildPicture, List<MemberDTO> members,
        List<ChannelDTO> channels) {

    public static GuildDetailDTO of(Guild guild) {
        return new GuildDetailDTO(
                guild.getId(),
                guild.getName(),
                guild.getGuildPicture(),
                guild.getMembers().stream().map(MemberDTO::of).toList(),
                guild.getChannels().stream().map(ChannelDTO::of).toList());
    }

}
