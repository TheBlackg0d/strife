package com.strife.users.service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.strife.users.dto.FriendStatusList;
import com.strife.users.dto.ProfileDTO;
import com.strife.users.dto.RelationshipDTO;
import com.strife.users.model.Profile;
import com.strife.users.model.Relationship;
import com.strife.users.model.RelationshipStatus;
import com.strife.users.repository.RelationshipRepository;

import jakarta.transaction.Transactional;

@Service
public class RelationshipService {

    private RelationshipRepository relationshipRepository;

    public RelationshipService(RelationshipRepository relationshipRepository) {
        this.relationshipRepository = relationshipRepository;
    }

    public FriendStatusList getFriends(Profile profile) {
        List<Relationship> relationships = relationshipRepository.findAllForProfile(profile.getUserId());

        Map<RelationshipStatus, List<ProfileDTO>> friends = Arrays.stream(RelationshipStatus.values())
                .collect(Collectors.toMap(status -> status, status -> relationships.stream()
                        .filter(r -> r.getStatus() == status)
                        .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                        .collect(Collectors.toList())));

        List<ProfileDTO> allFriends = relationships.stream()
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .collect(Collectors.toList());

        friends.put(RelationshipStatus.ALL, allFriends);

        return FriendStatusList.of(friends);
    }

    public RelationshipDTO sendFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = Relationship.of(profile, friend, RelationshipStatus.PENDING, profile.getUserId());
        relationshipRepository.save(relationship);
        return RelationshipDTO.fromEntity(relationship);
    }

    public RelationshipDTO acceptFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository.findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElseThrow(() -> new RuntimeException("Relationship not found"));

        if (relationship.getStatus().equals(RelationshipStatus.BLOCKED)) {
            throw new RuntimeException("Relationship is blocked");
        }

        if (relationship.getStatus().equals(RelationshipStatus.ACCEPTED)) {
            throw new RuntimeException("Relationship is already accepted");
        }

        relationship.setStatus(RelationshipStatus.ACCEPTED);
        relationshipRepository.save(relationship);
        return RelationshipDTO.fromEntity(relationship);
    }

    @Transactional
    public void declineFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository.findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElseThrow(() -> new RuntimeException("Relationship not found"));

        relationshipRepository.delete(relationship);

    }

}
