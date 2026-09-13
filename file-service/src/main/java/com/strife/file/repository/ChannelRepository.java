package com.strife.file.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.strife.file.model.Channel;

public interface ChannelRepository extends JpaRepository<Channel, UUID> {

    @Query("select count(c) > 0 from Channel c join c.members m where c.id = :channelId and m = :memberId")
    boolean existsByIdAndMemberId(@Param("channelId") UUID channelId, @Param("memberId") UUID memberId);
}
