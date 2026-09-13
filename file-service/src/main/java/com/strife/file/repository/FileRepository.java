package com.strife.file.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.file.model.File;

public interface FileRepository extends JpaRepository<File, UUID> {

    List<File> findByChannelId(UUID channelId);

    List<File> findByOwnerIdAndChannelIsNull(UUID ownerId);
}
