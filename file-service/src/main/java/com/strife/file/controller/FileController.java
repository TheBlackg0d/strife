package com.strife.file.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.strife.common.dto.ResponseDTO;
import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.file.FileUrlSigner;
import com.strife.common.security.JwtPrincipal;
import com.strife.file.dto.FileDTO;
import com.strife.file.dto.FileRequest;
import com.strife.file.model.File;
import com.strife.file.service.FileService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;

import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;

@RestController
@RequestMapping("api/v1/files")
@AllArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    private final FileUrlSigner fileUrlSigner;

    @PostMapping(path = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileDTO> uploadFile(@RequestPart("file") MultipartFile file,
            @RequestParam(value = "channelId", required = false) UUID channelId,
            @AuthenticationPrincipal JwtPrincipal principal) throws Exception {

        FileRequest fileRequest = new FileRequest(channelId, file);

        return ResponseEntity.ok(fileService.uploadFile(fileRequest, principal.id()));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<ResponseDTO> deleteFile(@PathVariable UUID fileId,
            @AuthenticationPrincipal JwtPrincipal principal) throws Exception {

        File file = fileService.getFileForUser(fileId, principal.id());
        fileService.deleteFile(file);
        return ResponseEntity.ok(new ResponseDTO(HttpStatus.NO_CONTENT.toString(), "File deleted successfully"));

    }

    @GetMapping("/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID fileId,
            @AuthenticationPrincipal JwtPrincipal principal) throws Exception {

        File file = fileService.getFileForUser(fileId, principal.id());

        return stream(file);
    }

    @GetMapping("/{fileId}/raw")
    public ResponseEntity<Resource> streamSignedFile(@PathVariable UUID fileId,
            @RequestParam("exp") long expiresAt,
            @RequestParam("sig") String signature) throws Exception {

        if (!fileUrlSigner.isValid(fileId, expiresAt, signature)) {
            throw new ActionNotAuthorizedException("Lien de fichier invalide ou expiré");
        }

        return stream(fileService.getFile(fileId));
    }

    private ResponseEntity<Resource> stream(File file) throws Exception {
        InputStream fileStream = fileService.downloadFile(file.getObjectKey());

        MediaType contentType = file.getContentType() == null
                ? MediaType.APPLICATION_OCTET_STREAM
                : MediaType.parseMediaType(file.getContentType());

        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePrivate())
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition(file.getOriginalName()))
                .body(new InputStreamResource(fileStream));
    }

    private String contentDisposition(String originalName) {
        if (originalName == null) {
            return "inline";
        }

        return "inline; filename*=UTF-8''" + URLEncoder.encode(originalName, StandardCharsets.UTF_8);
    }

}
