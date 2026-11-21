package com.strife.guild.mapper;

import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.model.Guild;

public class GuildMapper {

    public static Guild toEntity(GuildCreateRequest request) {
        Guild guild = new Guild();
        guild.setName(request.name());
        guild.setOwnerId(request.owner().id());

        return guild;
    }
}
