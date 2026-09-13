package com.strife.common.autoconfigure;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import com.strife.common.file.FileUrlProperties;
import com.strife.common.file.FileUrlSigner;


@AutoConfiguration
@ConditionalOnProperty(prefix = "file.url", name = "signing-key")
@EnableConfigurationProperties(FileUrlProperties.class)
public class CommonFileUrlAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean
    FileUrlSigner fileUrlSigner(FileUrlProperties properties) {
        return new FileUrlSigner(properties);
    }
}
