package com.strife.guild.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.web.client.RestClient;

import com.strife.common.dto.UserDTO;
import com.strife.common.event.guild.ChannelCreatedEvent;
import com.strife.common.security.JwtUtility;
import com.strife.guild.dto.GuildDTO;
import com.strife.guild.dto.GuildDetailDTO;
import com.strife.guild.dto.MemberDTO;
import com.strife.guild.event.EventRoutingKey;
import com.strife.guild.event.publisher.ChannelPublisher;
import com.strife.guild.repository.GuildRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class GuildControllerTests {

    private static final String SIGNING_KEY = UUID.randomUUID() + "-" + UUID.randomUUID();

    private static final UserDTO CREATOR = new UserDTO(UUID.randomUUID(), "creator@strife.dev", "creator");
    private static final UserDTO FRIEND = new UserDTO(UUID.randomUUID(), "friend@strife.dev", "friend");
    private static final UserDTO STRANGER = new UserDTO(UUID.randomUUID(), "stranger@strife.dev", "stranger");

    @DynamicPropertySource
    static void jwtProperties(DynamicPropertyRegistry registry) {
        registry.add("jwt.secret", () -> SIGNING_KEY);
    }

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private GuildRepository guildRepository;

    @MockitoBean
    private ChannelPublisher channelPublisher;

    private final JwtUtility jwtUtility = new JwtUtility(SIGNING_KEY, 300_000L);

    private RestClient client;

    @BeforeEach
    void setUp() {
        guildRepository.deleteAll();
        client = RestClient.builder()
                .baseUrl("http://localhost:" + port + "/api/v1/guild")
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                })
                .build();
    }

    @Test
    void createGuildMakesCreatorAndChosenFriendsMembers() {
        ResponseEntity<GuildDetailDTO> response = createGuild(CREATOR, "Les copains", List.of(FRIEND));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().members()).extracting(MemberDTO::id)
                .containsExactlyInAnyOrder(CREATOR.id(), FRIEND.id());
        assertThat(response.getBody().channels()).extracting("name").containsExactly("general");
    }

    @Test
    void ownerAndCreatorComeFromTheJwtNeverFromTheBody() {
        UUID forgedOwnerId = UUID.randomUUID();
        Map<String, Object> body = Map.of(
                "name", "Usurpée",
                "owner", Map.of("id", forgedOwnerId, "username", "forged"),
                "members", List.of(Map.of("id", FRIEND.id(), "username", FRIEND.username())));

        ResponseEntity<GuildDetailDTO> response = post(CREATOR, body);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(guildRepository.findById(response.getBody().id()).orElseThrow().getOwnerId())
                .isEqualTo(CREATOR.id());
        assertThat(response.getBody().members()).extracting(MemberDTO::id)
                .contains(CREATOR.id())
                .doesNotContain(forgedOwnerId);
        assertThat(response.getBody().members()).filteredOn(member -> member.id().equals(CREATOR.id()))
                .extracting(MemberDTO::username).containsExactly(CREATOR.username());
    }

    @Test
    void creatorListedAgainAmongMembersIsAddedOnlyOnce() {
        ResponseEntity<GuildDetailDTO> response = createGuild(CREATOR, "Doublon", List.of(CREATOR, FRIEND, FRIEND));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().members()).extracting(MemberDTO::id)
                .containsExactlyInAnyOrder(CREATOR.id(), FRIEND.id());
    }

    @Test
    void publishedChannelCreatedEventCarriesTheMembers() {
        ResponseEntity<GuildDetailDTO> response = createGuild(CREATOR, "Événement", List.of(FRIEND));

        ArgumentCaptor<ChannelCreatedEvent> event = ArgumentCaptor.forClass(ChannelCreatedEvent.class);
        verify(channelPublisher).sendChannelEvent(eq(EventRoutingKey.CHANNEL_CREATED), event.capture());

        assertThat(event.getValue().guildId()).isEqualTo(response.getBody().id());
        assertThat(event.getValue().channelId()).isEqualTo(response.getBody().channels().getFirst().id());
        assertThat(event.getValue().members()).extracting(UserDTO::id)
                .containsExactlyInAnyOrder(CREATOR.id(), FRIEND.id());
    }

    @Test
    void listReturnsOnlyGuildsTheUserBelongsTo() {
        UUID shared = createGuild(CREATOR, "Partagée", List.of(FRIEND)).getBody().id();
        UUID privateToCreator = createGuild(CREATOR, "Privée", List.of()).getBody().id();

        assertThat(list(CREATOR)).extracting(GuildDTO::id).containsExactlyInAnyOrder(shared, privateToCreator);
        assertThat(list(FRIEND)).extracting(GuildDTO::id).containsExactly(shared);
        assertThat(list(STRANGER)).isEmpty();
    }

    @Test
    void membersCanOpenTheGuildPage() {
        UUID guildId = createGuild(CREATOR, "Ouverte", List.of(FRIEND)).getBody().id();

        assertThat(get(CREATOR, guildId).getStatusCode()).isEqualTo(HttpStatus.OK);
        ResponseEntity<GuildDetailDTO> asFriend = get(FRIEND, guildId);
        assertThat(asFriend.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(asFriend.getBody().channels()).extracting("name").containsExactly("general");
    }

    @Test
    void nonMemberCannotOpenTheGuildPage() {
        UUID guildId = createGuild(CREATOR, "Fermée", List.of(FRIEND)).getBody().id();

        assertThat(get(STRANGER, guildId).getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
    }

    @Test
    void anonymousRequestsAreRejected() {
        ResponseEntity<String> response = client.get().uri("/list").retrieve().toEntity(String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private ResponseEntity<GuildDetailDTO> createGuild(UserDTO caller, String name, List<UserDTO> members) {
        List<Map<String, Object>> memberBodies = members.stream()
                .map(member -> Map.<String, Object>of("id", member.id(), "username", member.username()))
                .toList();
        return post(caller, Map.of("name", name, "members", memberBodies));
    }

    private ResponseEntity<GuildDetailDTO> post(UserDTO caller, Map<String, Object> body) {
        return client.post()
                .header("Authorization", bearer(caller))
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toEntity(GuildDetailDTO.class);
    }

    private List<GuildDTO> list(UserDTO caller) {
        return client.get().uri("/list")
                .header("Authorization", bearer(caller))
                .retrieve()
                .toEntity(new ParameterizedTypeReference<List<GuildDTO>>() {
                })
                .getBody();
    }

    private ResponseEntity<GuildDetailDTO> get(UserDTO caller, UUID guildId) {
        return client.get().uri("/{id}", guildId)
                .header("Authorization", bearer(caller))
                .retrieve()
                .toEntity(GuildDetailDTO.class);
    }

    private String bearer(UserDTO user) {
        return "Bearer " + jwtUtility.generateToken(user.email(), user);
    }
}
