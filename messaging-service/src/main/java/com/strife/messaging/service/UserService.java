package com.strife.messaging.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.strife.common.event.Profile.RelationshipChangeEvent;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.RelationshipStatus;
import com.strife.messaging.dto.UserDTO;
import com.strife.messaging.model.User;
import com.strife.messaging.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RessourceNotFoundException("User not found"));
    }

    public User createUser(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.id());
        user.setUsername(userDTO.username());
        return userRepository.save(user);
    }

    public void deleteFriendship(UUID userId, UUID friendId) {
        User user = getUser(userId);
        User friend = getUser(friendId);
        user.getFriends().remove(friend);
        userRepository.save(user);
    }

    public void addFriendship(UUID userId, UUID friendId) {
        User user = getUser(userId);
        User friend = getUser(friendId);
        user.getFriends().add(friend);
        userRepository.save(user);
    }

    @Transactional
    public void updateFriendship(RelationshipChangeEvent event) {

        if (event.type().equals(RelationshipStatus.BLOCKED) || event.type().equals(RelationshipStatus.REMOVED)) {
            deleteFriendship(event.userId(), event.friendId());
        } else if (event.type().equals(RelationshipStatus.ACCEPTED)) {
            addFriendship(event.userId(), event.friendId());
        }
    }
}
