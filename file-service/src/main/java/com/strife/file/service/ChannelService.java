package com.strife.file.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.strife.common.event.channel.ChannelUpsertedEvent;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.file.model.Channel;
import com.strife.file.repository.ChannelRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@AllArgsConstructor
@Slf4j
public class ChannelService {

    private final ChannelRepository channelRepository;

    @Transactional
    public void upsertChannel(ChannelUpsertedEvent event) {
        Channel channel = channelRepository.findById(event.channelId())
                .orElseGet(() -> new Channel(event.channelId()));

        channel.replaceMembers(event.memberIds());

        channelRepository.save(channel);

        log.debug("Channel {} replicated with {} members", event.channelId(), channel.getMembers().size());
    }

    public Channel getChannelForMember(UUID channelId, UUID userId) {
        if (!isMember(channelId, userId)) {
            throw new ActionNotAuthorizedException("You do not belong to this channel.");
        }

        return channelRepository.getReferenceById(channelId);
    }

    public boolean isMember(UUID channelId, UUID userId) {
        return channelRepository.existsByIdAndMemberId(channelId, userId);
    }
}
