package com.strife.messaging.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class MessageMedia {

    @Column(name = "file_id", nullable = false)
    private UUID fileId;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "original_name")
    private String originalName;
}
