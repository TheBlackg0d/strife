package com.strife.common.file;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class FileUrlSigner {

    private static final String HMAC_ALGORITHM = "HmacSHA256";

    private final FileUrlProperties properties;

    private final SecretKeySpec key;

    public FileUrlSigner(FileUrlProperties properties) {
        this.properties = properties;
        this.key = new SecretKeySpec(properties.signingKey().getBytes(StandardCharsets.UTF_8), HMAC_ALGORITHM);
    }

    public String signedUrl(UUID fileId) {
        if (fileId == null) {
            return null;
        }

        long expiresAt = nextExpiry();

        return properties.baseUrl() + "/" + fileId + "/raw?exp=" + expiresAt + "&sig=" + sign(fileId, expiresAt);
    }

    public boolean isValid(UUID fileId, long expiresAt, String signature) {
        if (fileId == null || signature == null) {
            return false;
        }

        if (expiresAt < Instant.now().getEpochSecond()) {
            return false;
        }

        byte[] expected = sign(fileId, expiresAt).getBytes(StandardCharsets.UTF_8);
        byte[] provided = signature.getBytes(StandardCharsets.UTF_8);

        return MessageDigest.isEqual(expected, provided);
    }

    private long nextExpiry() {
        long bucketSeconds = Math.max(1L, properties.bucket().toSeconds());
        long earliest = Instant.now().plus(properties.ttl()).getEpochSecond();

        return ((earliest / bucketSeconds) + 1) * bucketSeconds;
    }

    private String sign(UUID fileId, long expiresAt) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(key);

            byte[] digest = mac.doFinal((fileId + ":" + expiresAt).getBytes(StandardCharsets.UTF_8));

            return Base64.getUrlEncoder().withoutPadding().encodeToString(digest);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("Impossible de signer l'URL du fichier", e);
        }
    }

}
