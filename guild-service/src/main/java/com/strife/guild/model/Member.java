package com.strife.guild.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(name = "uq_member_guild_user", columnNames = { "guild_id", "user_id" }))
@Setter
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guild_id", nullable = false)
    private Guild guild;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    private String nickname;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private Instant joinedAt;

    @ManyToMany
    @JoinTable(name = "member_role", joinColumns = @JoinColumn(name = "member_id", foreignKey = @ForeignKey(name = "fk_member_role_member")), inverseJoinColumns = @JoinColumn(name = "role_id", foreignKey = @ForeignKey(name = "fk_member_role_role")))
    private Set<Role> roles = new HashSet<>();

    public Member(UUID userId, String username) {
        this.username = username;
        this.userId = userId;
        this.joinedAt = Instant.now();
    }
}
