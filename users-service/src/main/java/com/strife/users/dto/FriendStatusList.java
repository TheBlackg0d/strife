package com.strife.users.dto;

import java.util.List;
import java.util.Map;

import com.strife.users.model.RelationshipStatus;

public record FriendStatusList(Map<RelationshipStatus, List<ProfileDTO>> friends) {
}
