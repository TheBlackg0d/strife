package com.strife.file.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.strife.common.event.file.FileOwnerChangeEvent;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.FileScope;
import com.strife.file.dto.FileDTO;
import com.strife.file.dto.FileRequest;
import com.strife.file.model.File;
import com.strife.file.repository.FileRepository;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.ObjectWriteResponse;
import io.minio.PutObjectArgs;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;

@Service
@AllArgsConstructor
@Slf4j
public class FileService {

    private MinioClient minioClient;

    @Value("${minio.bucket.name}")
    private String bucketName;

    private FileRepository fileRepository;

    public String uploadedFile(FileRequest request, UUID userId) throws Exception {

        if (userAllowedToAccessFile(userId, request.owner())) {
            throw new ActionNotAuthorizedException("Can't upload this file at this location");
        }

        MultipartFile file = request.file();

        String filename = file.getOriginalFilename();
        InputStream fileStream = file.getInputStream();

        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

        PutObjectArgs putObjectArgs = PutObjectArgs.builder()
                .bucket(bucketName)
                .object(filename)
                .stream(fileStream, file.getSize(), -1L)
                .contentType(file.getContentType())
                .build();

        ObjectWriteResponse response = minioClient.putObject(putObjectArgs);

        String fileUrl = response.toString();

        createFile(new FileDTO(null, fileUrl, request.owner(), request.ressourceId(), request.scope()));

        return fileUrl;
    }

    public File getFile(UUID ownerId, UUID ressourceId) {
        return fileRepository.findByOwnerIdAndRessourceId(ownerId, ressourceId)
                .orElseThrow(() -> new RessourceNotFoundException("File not found"));
    }

    public File createFile(FileDTO fileDTO) {
        File file = new File();

        file.setOwnerId(fileDTO.ownerId());
        file.setScope(fileDTO.scope());
        file.setFileUrl(fileDTO.url());
        file.setRessourceId(fileDTO.ressourceId());

        return fileRepository.save(file);
    }

    public void updateFileOwnership(FileOwnerChangeEvent event) {
        fileRepository.findByRessourceIdAndScope(event.ressourceId(), event.scope())
                .ifPresentOrElse(
                        file -> {
                            file.setOwnerId(event.ownerId());
                            fileRepository.save(file);
                        },
                        () -> createFile(FileDTO.fromEvent(event)));

    }

    public InputStream downloadFile(String filename) throws Exception {

        try (GetObjectResponse in = minioClient
                .getObject(GetObjectArgs.builder().bucket(bucketName).object(filename).build())) {
            return in;
        } catch (Exception e) {
            log.error("Error downloading file: {}", e.getMessage());
        }

        return null;
    }

    public boolean userAllowedToAccessFile(UUID ownerId, UUID ressourceId) {
        return fileRepository.existsByRessourceIdAndOwnerId(ressourceId, ownerId);
    }

}
