package com.strife.file.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@Table(name = "channels")
@Getter
@Setter
@NoArgsConstructor
public class Channel {

    @Id
    private UUID id;

    @OneToMany(mappedBy = "channel")
    private List<File> files = new ArrayList<>();

    /**
     * Simples ids : file-service ne connaît des membres que leur appartenance,
     * c'est elle seule qui autorise l'accès aux fichiers du channel.
     */
    @ElementCollection
    @CollectionTable(name = "channel_members", joinColumns = @JoinColumn(name = "channel_id"))
    @Column(name = "member_id")
    private List<UUID> members = new ArrayList<>();

    public Channel(UUID id) {
        this.id = id;
    }

    public void replaceMembers(List<UUID> memberIds) {
        members.clear();

        if (memberIds != null) {
            members.addAll(memberIds);
        }
    }

    public boolean hasMember(UUID userId) {
        return members.contains(userId);
    }
}
