package com.strife.file.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.strife.common.exception.ActionNotAuthorizedException;
import com.strife.common.exception.RessourceNotFoundException;
import com.strife.common.model.FileScope;
import com.strife.common.security.JwtPrincipal;
import com.strife.file.dto.FileRequest;
import com.strife.file.model.File;
import com.strife.file.service.FileService;

import ch.qos.logback.core.joran.action.Action;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStream;
import java.util.UUID;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/v1/files")
@AllArgsConstructor
@Slf4j
public class FileController {

    private final FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<String> uplaodFileAvatar(@RequestBody FileRequest fileRequest,
            @AuthenticationPrincipal JwtPrincipal principal) {
        try {
            String filename = fileService.uploadedFile(fileRequest, principal.id());
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error uploading file");
        }
    }

    // @GetMapping("/download/{ressourceId}")
    // public ResponseEntity<byte[]> downloadFile(@PathVariable UUID ressourceId,
    // @AuthenticationPrincipal JwtPrincipal principal) {
    // try {

    // if (!fileService.userAllowedToAccessFile(principal.id(), ressourceId)) {
    // throw new ActionNotAuthorizedException("File not found");
    // }

    // File file = fileService.getFile(principal.id(), ressourceId);

    // String filename = file.getFileUrl();

    // InputStream fileData = fileService.downloadFile(filename);
    // return ResponseEntity.ok()
    // .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
    // .contentType(MediaType.APPLICATION_OCTET_STREAM)
    // .body(fileData.readAllBytes());
    // } catch (Exception e) {
    // log.error("Error downloading file");
    // return ResponseEntity.internalServerError().body(null);
    // }
    // }

}