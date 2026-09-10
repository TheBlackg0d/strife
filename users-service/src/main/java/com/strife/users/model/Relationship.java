package com.strife.users.model;

import java.util.UUID;

import com.strife.common.model.RelationshipStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "relationship", uniqueConstraints = {
        @UniqueConstraint(name = "relationship_unique", columnNames = { "first_friend_id", "second_friend_id" })
})
@Getter
@Setter
public class Relationship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "first_friend_id", nullable = false, foreignKey = @ForeignKey(name = "fk_relationship_first_friend"))
    private Profile firstFriend;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "second_friend_id", nullable = false, foreignKey = @ForeignKey(name = "fk_relationship_second_friend"))
    private Profile secondFriend;

    @Enumerated(EnumType.STRING)
    private RelationshipStatus status;

    private UUID statusInitiator;

    private Long version;

    public static Relationship of(Profile a, Profile b, RelationshipStatus status, UUID statusInitiator) {
        boolean aFirst = a.getUserId().compareTo(b.getUserId()) > 0;

        Relationship relationship = new Relationship();
        relationship.setFirstFriend(aFirst ? a : b);
        relationship.setSecondFriend(aFirst ? b : a);
        relationship.setStatus(status);
        relationship.setStatusInitiator(statusInitiator);
        relationship.setVersion(1L);

        return relationship;
    }

    public Profile getInitiatorProfile() {
        if (firstFriend.getUserId().equals(statusInitiator)) {
            return firstFriend;
        }
        if (secondFriend.getUserId().equals(statusInitiator)) {
            return secondFriend;
        }

        throw new IllegalStateException("Initiator " + statusInitiator + " is not part of relationship " + id);
    }

    public Profile otherFriend(UUID profileId) {
        if (firstFriend.getUserId().equals(profileId)) {
            return secondFriend;
        }
        if (secondFriend.getUserId().equals(profileId)) {
            return firstFriend;
        }
        throw new IllegalArgumentException("Profile " + profileId + " is not part of relationship " + id);
    }
}
