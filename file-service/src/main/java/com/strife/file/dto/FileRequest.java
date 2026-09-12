package com.strife.file.dto;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.strife.common.model.FileScope;

public record FileRequest(UUID owner, UUID ressourceId, FileScope scope, MultipartFile file) {

}
