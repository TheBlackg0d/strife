package com.strife.common.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.strife.common.dto.UserDTO;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * Authentifie la requête à partir du seul JWT : l'identité vient du claim
 * {@code user}, aucun accès base n'est nécessaire. Un service qui ne possède
 * pas la table des comptes peut donc l'utiliser tel quel.
 *
 * <p>
 * Contrepartie assumée : un compte supprimé reste authentifié jusqu'à
 * l'expiration de son access token ({@code jwt.expiration}). La révocation se
 * joue sur le refresh token, côté auth-service.
 *
 * <p>
 * Un token absent ou invalide laisse la requête anonyme — c'est au
 * {@code SecurityFilterChain} du service de décider si l'accès est refusé.
 */
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtility jwtUtility;

    private final WebAuthenticationDetailsSource detailsSource = new WebAuthenticationDetailsSource();

    public JwtAuthenticationFilter(JwtUtility jwtUtility) {
        this.jwtUtility = jwtUtility;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = jwtUtility.parseJwt(request);
            if (jwt != null && jwtUtility.validateJwtToken(jwt)) {
                UserDTO user = jwtUtility.getUserFromToken(jwt);

                if (user == null) {
                    log.warn("JWT valide mais sans claim \"user\" : requête laissée anonyme");
                } else {
                    JwtPrincipal principal = new JwtPrincipal(user.id(), user.email(), user.username());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            principal, null, Collections.emptyList());
                    authentication.setDetails(detailsSource.buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("User authenticated: {}", principal.email());
                }
            }

        } catch (Exception e) {
            log.error("Cannot set user authentication", e);
        }

        filterChain.doFilter(request, response);
    }

}
