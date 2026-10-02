package com.strife.guild.dto;

import java.util.UUID;
import com.strife.guild.model.Member;

public record MemberDTO(UUID id, String username) {

    public static MemberDTO of(Member member) {
        return new MemberDTO(member.getId(), member.getUsername());
    }
}
