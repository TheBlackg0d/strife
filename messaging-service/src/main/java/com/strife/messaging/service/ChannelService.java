package com.strife.messaging.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceDoNotMatchException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.DmPrivacy;
import com.strife.common.model.RelationshipStatus;
import com.strife.messaging.dto.DmRequest;
import com.strife.messaging.dto.GroupDmRequest;
import com.strife.messaging.model.Channel;
import com.strife.messaging.model.ChannelType;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.ChannelRepository;

import jakarta.transaction.Transactional;

@Service
public class ChannelService {

    private static final List<ChannelType> PRIVATE_TYPES = List.of(ChannelType.DM, ChannelType.GROUP_DM);

    private final ChannelRepository channelRepository;
    private final UserService userService;

    public ChannelService(ChannelRepository channelRepository, UserService userService) {
        this.channelRepository = channelRepository;
        this.userService = userService;
    }

    @Transactional
    public Channel getChannel(UUID channelId) {
        return channelRepository.findByIdWithMembers(channelId)
                .orElseThrow(() -> new RessourceNotFoundException("Channel not found"));
    }

    @Transactional
    public Channel getChannelForMember(UUID channelId, UUID userId) {
        Channel channel = getChannel(channelId);
        if (!channelRepository.existsByIdAndMemberId(channelId, userId)) {
            throw new ActionNotAuthorizedException("You do not belong to this channel.");
        }
        return channel;
    }

    public boolean memberBelongToChannel(UUID channelId, UUID userId) {
        return channelRepository.existsByIdAndMemberId(channelId, userId);
    }

    @Transactional
    public List<Channel> getPrivateChannels(UUID userId) {
        return channelRepository.findAllByMemberIdAndTypeIn(userId, PRIVATE_TYPES);
    }

    @Transactional
    public Channel createDm(DmRequest request, UUID currentUserId) {
        if (request.memberId() == null) {
            throw new RessourceDoNotMatchException("A direct channel needs a member.", "memberId");
        }
        return createDm(userService.getUser(currentUserId), userService.getUser(request.memberId()));
    }

    @Transactional
    public Channel createDm(User currentUser, User member) {
        if (currentUser.getId().equals(member.getId())) {
            throw new RessourceDoNotMatchException("A direct channel needs two distinct members.", "memberId");
        }

        checkDmAllowed(currentUser, member);

        return channelRepository.findByDmKey(Channel.dmKeyFor(currentUser.getId(), member.getId()))
                .orElseGet(() -> channelRepository.save(Channel.dm(currentUser, member)));
    }

    @Transactional
    public Channel createGroupDm(GroupDmRequest request, UUID currentUserId) {
        User currentUser = userService.getUser(currentUserId);
        Channel channel = Channel.groupDm(currentUser, request.name());

        if (request.members() != null) {
            request.members().stream()
                    .filter(memberId -> !memberId.equals(currentUserId))
                    .forEach(memberId -> {
                        User member = userService.getUser(memberId);
                        checkDmAllowed(currentUser, member);
                        channel.addMember(member);
                    });
        }

        if (channel.getMembers().size() < Channel.MIN_GROUP_MEMBERS) {
            throw new RessourceDoNotMatchException(
                    "A group channel needs at least " + Channel.MIN_GROUP_MEMBERS + " members.", "members");
        }

        return channelRepository.save(channel);
    }

    @Transactional
    public void toggleChannelVisibility(Channel channel, RelationshipStatus status) {
        channel.setShowChannel(status.equals(RelationshipStatus.ACCEPTED));
        channelRepository.save(channel);
    }

    private void checkDmAllowed(User currentUser, User target) {
        if (target.getDmPrivacy().equals(DmPrivacy.FRIENDS) && !currentUser.getFriends().contains(target)) {
            throw new ActionNotAuthorizedException("User " + target.getUsername()
                    + " has private DMs enabled and is not a friend of the current user.");
        }

        if (target.getDmPrivacy().equals(DmPrivacy.FRIENDS_OF_FRIENDS) && currentUser.getFriends().stream()
                .noneMatch(friend -> friend.getFriends().contains(target))) {
            throw new ActionNotAuthorizedException("User " + target.getUsername()
                    + " has friends of friends DMs enabled and is not a friend of a friend of the current user.");
        }
    }
}
