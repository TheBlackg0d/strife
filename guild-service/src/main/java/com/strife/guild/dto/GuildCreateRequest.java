package com.strife.guild.dto;

import java.util.List;

public record GuildCreateRequest(
                String name,
                List<MemberDTO> members) {

}
