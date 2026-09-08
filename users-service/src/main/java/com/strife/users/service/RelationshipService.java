package com.strife.users.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceAlreadyExistException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.RelationshipStatus;
import com.strife.users.dto.FriendStatusList;
import com.strife.users.dto.ProfileDTO;
import com.strife.users.dto.RelationshipDTO;
import com.strife.users.model.FriendListFilter;
import com.strife.users.model.Profile;
import com.strife.users.model.Relationship;
import com.strife.users.model.StatusPreference;
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

        FriendStatusList friends = new FriendStatusList();

        friends.put(FriendListFilter.ALL, this.getAllFriends(relationships, profile));
        friends.put(FriendListFilter.PENDING_FRIEND_REQUEST_SENT, this.getFriendRequestSent(relationships, profile));
        friends.put(FriendListFilter.PENDING_FRIEND_REQUEST_RECEIVED,
                this.getFriendRequestReceived(relationships, profile));
        friends.put(FriendListFilter.ONLINE, this.getOnlineFriends(relationships, profile));
        friends.put(FriendListFilter.BLOCKED, this.getBlockedFriends(relationships, profile));

        return friends;
    }

    public RelationshipDTO sendFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository.findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElse(null);

        if (relationship != null) {
            if (relationship.getStatus().equals(RelationshipStatus.BLOCKED)) {
                throw new ActionNotAuthorizedException("You were blocked by this user. Cannot send friend request");
            }
        }

        relationship = Relationship.of(profile, friend, RelationshipStatus.PENDING, profile.getUserId());
        relationshipRepository.save(relationship);
        return RelationshipDTO.fromEntity(relationship);
    }

    public RelationshipDTO acceptFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository.findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElseThrow(() -> new RessourceNotFoundException("Relationship not found"));

        if (relationship.getStatus().equals(RelationshipStatus.BLOCKED)) {
            throw new ActionNotAuthorizedException("Relationship is blocked");
        }

        if (relationship.getStatus().equals(RelationshipStatus.ACCEPTED)) {
            throw new RessourceAlreadyExistException("Relationship is already accepted", "profile");
        }

        relationship.setStatus(RelationshipStatus.ACCEPTED);
        relationshipRepository.save(relationship);
        return RelationshipDTO.fromEntity(relationship);
    }

    /** Bloque un profil, qu'une relation existe déjà ou non. */
    @Transactional
    public RelationshipDTO blockFriend(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository
                .findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElseGet(() -> Relationship.of(profile, friend, RelationshipStatus.BLOCKED, profile.getUserId()));

        relationship.setStatus(RelationshipStatus.BLOCKED);
        relationship.setStatusInitiator(profile.getUserId());
        relationshipRepository.save(relationship);

        return RelationshipDTO.fromEntity(relationship);
    }

    @Transactional
    public void declineFriendRequest(Profile profile, Profile friend) {
        Relationship relationship = relationshipRepository.findByProfilePair(profile.getUserId(), friend.getUserId())
                .orElseThrow(() -> new RuntimeException("Relationship not found"));

        relationshipRepository.delete(relationship);

    }

    private List<ProfileDTO> getFriendRequestSent(List<Relationship> relationships, Profile profile) {
        return relationships.stream()
                .filter(r -> r.getStatus() == RelationshipStatus.PENDING
                        && r.getStatusInitiator().equals(profile.getUserId()))
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .toList();
    }

    private List<ProfileDTO> getFriendRequestReceived(List<Relationship> relationships, Profile profile) {
        return relationships.stream()
                .filter(r -> r.getStatus() == RelationshipStatus.PENDING
                        && !r.getStatusInitiator().equals(profile.getUserId()))
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .toList();
    }

    private List<ProfileDTO> getOnlineFriends(List<Relationship> relationships, Profile profile) {
        return relationships.stream()
                .filter(r -> r.getStatus() == RelationshipStatus.ACCEPTED)
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .filter(p -> p.statusPreference().equals(StatusPreference.ONLINE))
                .toList();
    }

    private List<ProfileDTO> getBlockedFriends(List<Relationship> relationships, Profile profile) {
        return relationships.stream()
                .filter(r -> r.getStatus() == RelationshipStatus.BLOCKED)
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .toList();
    }

    private List<ProfileDTO> getAllFriends(List<Relationship> relationships, Profile profile) {
        return relationships.stream()
                .filter(r -> r.getStatus() == RelationshipStatus.ACCEPTED)
                .map(r -> ProfileDTO.fromEntity(r.otherFriend(profile.getUserId())))
                .toList();
    }

}
