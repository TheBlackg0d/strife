package com.strife.messaging.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.messaging.model.PrivateChannel;
import com.strife.messaging.repository.PrivateChannelRepository;

@Service
public class PrivateChannelService {
    private final PrivateChannelRepository channelRepository;

    public PrivateChannelService(PrivateChannelRepository channelRepository) {
        this.channelRepository = channelRepository;
    }

    public List<PrivateChannel> getPrivateChannelsForUser(UUID userId) {
        return channelRepository.findByMembers_UserId(userId);
    }

}
