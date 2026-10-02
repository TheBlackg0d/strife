package com.strife.guild.dto;

import java.util.UUID;

public record GuildDTO(UUID id, String name, String guildPicture) {

    public static GuildDTO of(com.strife.guild.model.Guild guild) {
        return new GuildDTO(
                guild.getId(),
                guild.getName(),
                guild.getGuildPicture());
    }

}
