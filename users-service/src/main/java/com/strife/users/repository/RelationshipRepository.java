package com.strife.users.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.strife.users.model.Relationship;
import com.strife.users.model.RelationshipStatus;

public interface RelationshipRepository extends JpaRepository<Relationship, UUID> {

        @Query("""
                        select r from Relationship r
                        where r.firstFriend.userId = :profileId or r.secondFriend.userId = :profileId
                        """)
        List<Relationship> findAllForProfile(@Param("profileId") UUID profileId);

        @Query("""
                        select r from Relationship r
                        where (r.firstFriend.userId = :profileId or r.secondFriend.userId = :profileId)
                          and r.status = :status
                        """)
        List<Relationship> findAllForProfileByStatus(@Param("profileId") UUID profileId,
                        @Param("status") RelationshipStatus status);

        @Query("""
                        select r from Relationship r
                        where (r.firstFriend.userId = :a and r.secondFriend.userId = :b)
                           or (r.firstFriend.userId = :b and r.secondFriend.userId = :a)
                        """)
        Optional<Relationship> findByProfilePair(@Param("a") UUID a, @Param("b") UUID b);
}
