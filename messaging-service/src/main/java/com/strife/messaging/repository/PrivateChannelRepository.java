package com.strife.messaging.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.messaging.model.PrivateChannel;

public interface PrivateChannelRepository extends JpaRepository<PrivateChannel, UUID> {

}
