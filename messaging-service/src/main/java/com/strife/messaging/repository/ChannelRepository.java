package com.strife.messaging.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.strife.messaging.model.Channel;
import com.strife.messaging.model.ChannelType;

public interface ChannelRepository extends JpaRepository<Channel, UUID> {

        @EntityGraph(attributePaths = "members")
        Optional<Channel> findByDmKey(String dmKey);

        @EntityGraph(attributePaths = "members")
        @Query("""
                        select c from Channel c
                        where c.type in :types
                          and exists (select 1 from c.members m where m.id = :userId)
                        """)
        List<Channel> findAllByMemberIdAndTypeIn(@Param("userId") UUID userId,
                        @Param("types") Collection<ChannelType> types);

        @EntityGraph(attributePaths = "members")
        @Query("select c from Channel c where c.id = :id")
        Optional<Channel> findByIdWithMembers(@Param("id") UUID id);

        @Query("""
                        select case when count(c) > 0 then true else false end
                        from Channel c join c.members m
                        where c.id = :id and m.id = :memberId
                        """)
        boolean existsByIdAndMemberId(@Param("id") UUID id, @Param("memberId") UUID memberId);

}
