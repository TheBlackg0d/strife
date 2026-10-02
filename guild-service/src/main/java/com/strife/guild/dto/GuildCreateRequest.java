package com.strife.guild.dto;

import java.util.List;
import java.util.UUID;

public record GuildCreateRequest(
        String name,
        MemberDTO owner,
        List<MemberDTO> members) {

}