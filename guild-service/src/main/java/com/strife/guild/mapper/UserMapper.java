package com.strife.guild.mapper;

import com.strife.guild.model.Member;
import com.strife.guild.dto.MemberDTO;

public class UserMapper {

    public static Member toEntity(MemberDTO userDto) {
        return new Member(userDto.id(), userDto.username());
    }
}
