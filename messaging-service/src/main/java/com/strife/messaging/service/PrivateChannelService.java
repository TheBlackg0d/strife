package com.strife.messaging.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceDoNotMatchException;
import com.strife.common.model.DmPrivacy;
import com.strife.messaging.dto.PrivateChannelRequest;
import com.strife.messaging.model.PrivateChannel;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.PrivateChannelRepository;

import jakarta.transaction.Transactional;

@Service
public class PrivateChannelService {

    private final PrivateChannelRepository channelRepository;
    private final UserService userService;

    public PrivateChannelService(PrivateChannelRepository channelRepository, UserService userService) {
        this.channelRepository = channelRepository;
        this.userService = userService;
    }

    @Transactional
    public PrivateChannel createPrivateChannel(PrivateChannelRequest request, UUID currentUserId) {
        PrivateChannel channel = new PrivateChannel();

        User currentUser = userService.getUser(currentUserId);

        channel.setChannelName(request.channelName());
        request.members().forEach(userId -> {
            User user = userService.getUser(userId);

            if (user.getDmPrivacy().equals(DmPrivacy.FRIENDS) && !currentUser.getFriends().contains(user)) {
                throw new ActionNotAuthorizedException("User " + user.getUsername()
                        + " has private DMs enabled and is not a friend of the current user.");
            }

            if (user.getDmPrivacy().equals(DmPrivacy.FRIENDS_OF_FRIENDS) && !currentUser.getFriends().stream()
                    .anyMatch(friend -> friend.getFriends().contains(user))) {
                throw new ActionNotAuthorizedException("User " + user.getUsername()
                        + " has friends of friends DMs enabled and is not a friend of a friend of the current user.");
            }

            channel.addUser(user);
        });
        return channelRepository.save(channel);
    }
}
