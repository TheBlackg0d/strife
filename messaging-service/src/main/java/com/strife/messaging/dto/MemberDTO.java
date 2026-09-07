package com.strife.messaging.dto;

import java.util.UUID;

import com.strife.messaging.model.Member;

public record MemberDTO(UUID userId, String username) {

    public static MemberDTO from(Member member) {
        return new MemberDTO(member.getUserId(), member.getUsername());
    }
}
