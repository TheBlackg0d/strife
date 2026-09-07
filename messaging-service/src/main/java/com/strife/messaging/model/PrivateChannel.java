package com.strife.messaging.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "private_channels")
@NoArgsConstructor
@Setter
@Getter
public class PrivateChannel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String channelName;

    @ManyToMany(mappedBy = "privateChannels", fetch = FetchType.LAZY)
    private List<Member> members = new ArrayList<>();
}
