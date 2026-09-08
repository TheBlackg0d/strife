package com.strife.users.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

import com.strife.common.model.DmPrivacy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profile")
@Getter
@Setter
public class Profile {

    @Id
    private UUID userId;

    @Column(unique = true)
    private String username;

    private String email;

    @Enumerated(EnumType.STRING)
    private StatusPreference statusPreference;

    private String avatar;

    private String bio;

    @Enumerated(EnumType.STRING)
    private DmPrivacy dmPrivacy;

    @OneToMany(mappedBy = "firstFriend", fetch = FetchType.LAZY)
    private List<Relationship> relationshipsAsFirstFriend = new ArrayList<>();

    @OneToMany(mappedBy = "secondFriend", fetch = FetchType.LAZY)
    private List<Relationship> relationshipsAsSecondFriend = new ArrayList<>();

    private Long version;

    public List<Relationship> getRelationships() {
        return Stream.concat(relationshipsAsFirstFriend.stream(), relationshipsAsSecondFriend.stream())
                .toList();
    }
}
