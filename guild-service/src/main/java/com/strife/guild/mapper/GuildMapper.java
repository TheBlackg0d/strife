package com.strife.guild.mapper;

import java.util.UUID;

import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.model.Guild;

public class GuildMapper {

    public static Guild toEntity(GuildCreateRequest request, UUID ownerId) {
        Guild guild = new Guild();
        guild.setName(request.name());
        guild.setOwnerId(ownerId);

        return guild;
    }
}
