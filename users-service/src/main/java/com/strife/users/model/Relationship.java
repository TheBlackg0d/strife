package com.strife.users.model;

import java.util.UUID;

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
    private Profile firstFriendId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "second_friend_id", nullable = false, foreignKey = @ForeignKey(name = "fk_relationship_second_friend"))
    private Profile secondFriendId;

    @Enumerated(EnumType.STRING)
    private RelationshipStatus status;

    private UUID statusInitiator;

    private Long version;
}
