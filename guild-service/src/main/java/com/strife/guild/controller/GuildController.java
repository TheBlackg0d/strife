package com.strife.guild.controller;

import com.strife.common.security.JwtPrincipal;
import com.strife.guild.dto.GuildCreateRequest;
import com.strife.guild.dto.GuildDTO;
import com.strife.guild.dto.GuildDetailDTO;
import com.strife.guild.service.GuildService;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/guild")
public class GuildController {

    private final GuildService guildService;

    public GuildController(GuildService guildService) {
        this.guildService = guildService;
    }

    @PostMapping
    public ResponseEntity<GuildDetailDTO> createGuild(@RequestBody GuildCreateRequest request,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(GuildDetailDTO.of(guildService.createGuild(request, principal)));
    }

    @GetMapping("/list")
    public ResponseEntity<List<GuildDTO>> listGuilds(@AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(guildService.listGuilds(principal.id()).stream().map(GuildDTO::of).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuildDetailDTO> getGuildById(@PathVariable UUID id,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(GuildDetailDTO.of(guildService.getGuildById(id, principal.id())));
    }
}
