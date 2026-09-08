package com.strife.users.dto;

import com.strife.common.model.RelationshipStatus;
import com.strife.users.model.Relationship;

public record RelationshipDTO(ProfileDTO friend1, ProfileDTO friend2, RelationshipStatus status) {

    public static RelationshipDTO fromEntity(Relationship relationship) {
        return new RelationshipDTO(ProfileDTO.fromEntity(relationship.getFirstFriend()),
                ProfileDTO.fromEntity(relationship.getSecondFriend()), relationship.getStatus());
    }
}
