package com.strife.file.dto;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;


public record FileRequest(UUID channelId, MultipartFile file) {

}
