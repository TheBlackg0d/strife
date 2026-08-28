package com.strife.users.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "profile", uniqueConstraints = {
        @UniqueConstraint(name = "username_discriminator_unique", columnNames = { "username", "discriminator" })
})
@Getter
@Setter
public class Profile {

    @Id
    private UUID userId;

    private String username;

    private String discriminator;

    private String email;

    @Enumerated(EnumType.STRING)
    private StatusPreference statusPreference;

    private String avatar;

    private String bio;

    @Enumerated(EnumType.STRING)
    private DmPrivacy dmPrivacy;

    private Boolean profileComplete;

    private Long version;
}
