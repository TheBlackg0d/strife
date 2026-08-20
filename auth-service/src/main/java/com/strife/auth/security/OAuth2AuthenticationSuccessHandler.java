package com.strife.auth.security;

import com.strife.auth.repository.AccountRepository;
import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.strife.auth.service.AccountService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AccountRepository accountRepository;
    private final JwtUtility jwtUtility;
    private final AccountService accountService;

    public OAuth2AuthenticationSuccessHandler(JwtUtility jwtUtility, AccountService accountService,
            AccountRepository accountRepository) {
        this.jwtUtility = jwtUtility;
        this.accountService = accountService;
        this.accountRepository = accountRepository;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

        String providerName = oauthToken.getAuthorizedClientRegistrationId();

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String providerUserId = oauth2User.getAttribute("sub");

        String token = jwtUtility.generateToken(email);

        if (!this.accountService.existsByEmail(email)) {
            this.accountService.createAccountFromOAuth2User(email, providerName, providerUserId);
        }
        this.accountService.addProviderToAccount(email, providerName, providerUserId);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:8080")
                .fragment("token=" + token)
                .build().toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }

}
