package com.strife.common.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.security.Principal;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.strife.common.dto.UserDTO;

class JwtAuthenticationFilterTests {

    private static final UserDTO USER = new UserDTO(UUID.randomUUID(), "ada@strife.dev", "ada");

    private final JwtUtility jwtUtility = new JwtUtility("0123456789-0123456789-0123456789-0123456789", 300_000L);

    private final JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtUtility);

    @AfterEach
    void clearContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void authenticatesFromTokenClaimsWithoutAnyLookup() throws Exception {
        Authentication authentication = authenticate(jwtUtility.generateToken(USER.email(), USER));

        assertThat(authentication).isNotNull();
        assertThat(authentication.getPrincipal()).isEqualTo(new JwtPrincipal(USER.id(), USER.email(), USER.username()));
        assertThat(authentication.getCredentials()).isNull();
        assertThat(authentication.getAuthorities()).isEmpty();
    }

    /**
     * Un contrôleur qui prend un {@link Principal} en paramètre reçoit
     * l'{@link Authentication} elle-même, dont le nom est déduit du principal.
     * Sans {@code AuthenticatedPrincipal} sur {@link JwtPrincipal}, ce nom
     * retomberait sur le {@code toString()} du record au lieu de l'email.
     */
    @Test
    void exposesEmailAsPrincipalName() throws Exception {
        Authentication authentication = authenticate(jwtUtility.generateToken(USER.email(), USER));

        assertThat(authentication).isInstanceOf(Principal.class);
        assertThat(((Principal) authentication).getName()).isEqualTo(USER.email());
    }

    @Test
    void leavesRequestAnonymousWhenTokenIsMissing() throws Exception {
        assertThat(authenticate(null)).isNull();
    }

    @Test
    void leavesRequestAnonymousWhenSignatureDoesNotMatch() throws Exception {
        String foreignToken = new JwtUtility("aaaaaaaaaa-aaaaaaaaaa-aaaaaaaaaa-aaaaaaaaaa", 300_000L)
                .generateToken(USER.email(), USER);

        assertThat(authenticate(foreignToken)).isNull();
    }

    @Test
    void leavesRequestAnonymousWhenTokenHasExpired() throws Exception {
        String expiredToken = new JwtUtility("0123456789-0123456789-0123456789-0123456789", -1_000L)
                .generateToken(USER.email(), USER);

        assertThat(authenticate(expiredToken)).isNull();
    }

    /**
     * Le filtre n'interrompt jamais la chaîne : c'est le SecurityFilterChain du
     * service qui décide de refuser une requête non authentifiée.
     */
    @Test
    void alwaysContinuesTheChain() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer not-a-jwt");
        MockFilterChain chain = new MockFilterChain();

        filter.doFilter(request, new MockHttpServletResponse(), chain);

        assertThat(chain.getRequest()).isSameAs(request);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    private Authentication authenticate(String token) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        if (token != null) {
            request.addHeader("Authorization", "Bearer " + token);
        }

        filter.doFilter(request, new MockHttpServletResponse(), new MockFilterChain());

        return SecurityContextHolder.getContext().getAuthentication();
    }
}
