package com.strife.file.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.file.FileUrlSigner;
import com.strife.file.dto.FileDTO;
import com.strife.file.dto.FileRequest;
import com.strife.file.model.Channel;
import com.strife.file.model.File;
import com.strife.file.repository.FileRepository;

import io.minio.BucketExistsArgs;
import io.minio.GetObjectArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;

@Service
@Slf4j
public class FileService {

    private final MinioClient minioClient;

    private final FileRepository fileRepository;

    private final ChannelService channelService;

    private final FileUrlSigner fileUrlSigner;

    @Value("${minio.bucket.name}")
    private String bucketName;

    public FileService(MinioClient minioClient, FileRepository fileRepository, ChannelService channelService,
            FileUrlSigner fileUrlSigner) {
        this.minioClient = minioClient;
        this.fileRepository = fileRepository;
        this.channelService = channelService;
        this.fileUrlSigner = fileUrlSigner;
    }

    public FileDTO uploadFile(FileRequest request, UUID userId) throws Exception {
        Channel channel = resolveChannel(request.channelId(), userId);

        MultipartFile file = request.file();

        String originalName = file.getOriginalFilename();
        String objectKey = buildObjectKey(channel, userId, originalName);

        if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
        }

        try (InputStream fileStream = file.getInputStream()) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectKey)
                    .stream(fileStream, file.getSize(), -1L)
                    .contentType(file.getContentType())
                    .build());
        }

        File saved = new File();
        saved.setOwnerId(userId);
        saved.setChannel(channel);
        saved.setObjectKey(objectKey);
        saved.setOriginalName(originalName);
        saved.setContentType(file.getContentType());

        return FileDTO.fromEntity(fileRepository.save(saved), fileUrlSigner);
    }


    public File getFile(UUID fileId) {
        return fileRepository.findById(fileId)
                .orElseThrow(() -> new RessourceNotFoundException("File not found"));
    }

    public File getFileForUser(UUID fileId, UUID userId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RessourceNotFoundException("File not found"));

        if (!userAllowedToAccessFile(file, userId)) {
            throw new ActionNotAuthorizedException("Can't access this file");
        }

        return file;
    }

    public List<File> getChannelFiles(UUID channelId, UUID userId) {
        channelService.getChannelForMember(channelId, userId);

        return fileRepository.findByChannelId(channelId);
    }

    public boolean userAllowedToAccessFile(File file, UUID userId) {
        if (file.getChannel() == null) {
            return file.getOwnerId().equals(userId);
        }

        return channelService.isMember(file.getChannel().getId(), userId);
    }

    public InputStream downloadFile(String objectKey) throws Exception {
        return minioClient.getObject(GetObjectArgs.builder().bucket(bucketName).object(objectKey).build());
    }

    @Transactional
    public void deleteFile(File file) throws Exception {
        fileRepository.delete(file);
        minioClient.removeObject(RemoveObjectArgs.builder().bucket(bucketName).object(file.getObjectKey()).build());
    }

    private Channel resolveChannel(UUID channelId, UUID userId) {
        if (channelId == null) {
            return null;
        }

        return channelService.getChannelForMember(channelId, userId);
    }

    private String buildObjectKey(Channel channel, UUID ownerId, String originalName) {
        int dot = originalName == null ? -1 : originalName.lastIndexOf('.');
        String extension = dot > -1 ? originalName.substring(dot) : "";

        String prefix = channel == null
                ? "users/" + ownerId
                : "channels/" + channel.getId();

        return prefix + "/" + UUID.randomUUID() + extension;
    }

}
