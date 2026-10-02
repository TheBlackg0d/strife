package com.strife.guild.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Setter
@Getter
public class Guild {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "owner_id", nullable = false)
    private UUID ownerId;

    @Column(nullable = false)
    private String name;

    private String guildPicture;

    @OneToMany(mappedBy = "guild", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Member> members = new HashSet<>();

    @OneToMany(mappedBy = "guild", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Channel> channels = new HashSet<>();
}
