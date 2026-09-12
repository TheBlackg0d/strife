package com.strife.file.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.strife.common.model.FileScope;
import com.strife.file.model.File;

public interface FileRepository extends JpaRepository<File, UUID> {

    Optional<File> findByOwnerIdAndRessourceId(UUID ownerId, UUID ressourceId);

    Optional<File> findByRessourceIdAndScope(UUID ressourceId, FileScope scope);

    boolean existsByRessourceIdAndOwnerId(UUID ressourceId, UUID ownerId);

    boolean existsByFileUrlAndOwnerId(String fileUrl, UUID ownerId);
}
