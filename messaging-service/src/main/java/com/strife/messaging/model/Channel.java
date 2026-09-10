package com.strife.messaging.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.strife.common.exception.RessourceDoNotMatchException;

import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "channels", uniqueConstraints = @UniqueConstraint(name = "uk_channel_dm_key", columnNames = "dm_key"), indexes = {
        @Index(name = "idx_channel_type", columnList = "type"),
        @Index(name = "idx_channel_guild", columnList = "guild_id")
}, check = @CheckConstraint(name = "ck_channel_shape", constraint = """
        (type = 'DM' and dm_key is not null and name is null and owner_id is null and guild_id is null)
        or (type = 'GROUP_DM' and dm_key is null and name is not null and owner_id is not null and guild_id is null)
        or (type = 'GUILD_TEXT' and dm_key is null and name is not null and guild_id is not null)
        """))
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Channel {

    public static final int MIN_GROUP_MEMBERS = 3;
    public static final int MAX_GROUP_MEMBERS = 10;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private ChannelType type;

    private String name;

    @Column(name = "dm_key")
    private String dmKey;

    @Column(name = "guild_id")
    private UUID guildId;

    @Column(nullable = false)
    private boolean showChannel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", foreignKey = @ForeignKey(name = "fk_channel_owner"))
    private User owner;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "channel_members", joinColumns = @JoinColumn(name = "channel_id"), inverseJoinColumns = @JoinColumn(name = "user_id"), foreignKey = @ForeignKey(name = "fk_channel_members_channel"), inverseForeignKey = @ForeignKey(name = "fk_channel_members_user"))
    private List<User> members = new ArrayList<>();

    @OneToMany(mappedBy = "channel")
    private List<Message> messages = new ArrayList<>();

    public static Channel dm(User first, User second) {
        if (first.getId().equals(second.getId())) {
            throw new RessourceDoNotMatchException("A direct channel needs two distinct members.", "memberId");
        }

        Channel channel = new Channel();
        channel.type = ChannelType.DM;
        channel.dmKey = dmKeyFor(first.getId(), second.getId());
        channel.members.add(first);
        channel.members.add(second);
        return channel;
    }

    public static Channel groupDm(User owner, String name) {
        if (name == null || name.isBlank()) {
            throw new RessourceDoNotMatchException("A group channel needs a name.", "name");
        }

        Channel channel = new Channel();
        channel.type = ChannelType.GROUP_DM;
        channel.name = name;
        channel.owner = owner;
        channel.members.add(owner);
        return channel;
    }

    public static Channel guildText(UUID guildId, String name) {
        if (name == null || name.isBlank()) {
            throw new RessourceDoNotMatchException("A guild channel needs a name.", "name");
        }

        Channel channel = new Channel();
        channel.type = ChannelType.GUILD_TEXT;
        channel.name = name;
        channel.guildId = guildId;
        return channel;
    }

    public static String dmKeyFor(UUID first, UUID second) {
        return first.toString().compareTo(second.toString()) <= 0
                ? first + ":" + second
                : second + ":" + first;
    }

    public boolean isDm() {
        return type == ChannelType.DM;
    }

    public boolean isGroupDm() {
        return type == ChannelType.GROUP_DM;
    }

    public void addMember(User user) {
        if (type != ChannelType.GROUP_DM) {
            throw new RessourceDoNotMatchException("Only group channels accept new members.", "members");
        }
        if (hasMember(user)) {
            return;
        }
        if (members.size() >= MAX_GROUP_MEMBERS) {
            throw new RessourceDoNotMatchException(
                    "A group channel cannot hold more than " + MAX_GROUP_MEMBERS + " members.", "members");
        }
        members.add(user);
    }

    public void removeMember(User user) {
        if (type != ChannelType.GROUP_DM) {
            throw new RessourceDoNotMatchException("Only group channels accept member removal.", "members");
        }
        members.removeIf(member -> member.getId().equals(user.getId()));
    }

    public boolean hasMember(User user) {
        return members.stream().anyMatch(member -> member.getId().equals(user.getId()));
    }

    public boolean isOwner(User user) {
        return owner != null && owner.getId().equals(user.getId());
    }

    public User otherMember(User user) {
        return members.stream()
                .filter(member -> !member.getId().equals(user.getId()))
                .findFirst()
                .orElse(null);
    }
}
