package com.strife.users.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.strife.users.model.RelationshipStatus;

public class FriendStatusList extends HashMap<RelationshipStatus, List<ProfileDTO>> {

    public static FriendStatusList of(Map<RelationshipStatus, List<ProfileDTO>> map) {
        FriendStatusList friendStatusList = new FriendStatusList();
        friendStatusList.putAll(map);
        return friendStatusList;
    }
}
