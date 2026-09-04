package com.strife.auth.security;

import com.strife.auth.model.Account;
import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import com.strife.auth.service.AccountService;
import com.strife.auth.service.TokenRefreshService;
import com.strife.common.dto.UserDTO;
import com.strife.common.security.JwtUtility;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtility jwtUtility;
    private final AccountService accountService;
    private final TokenRefreshService tokenRefreshService;

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

        Account account = this.accountService.getAccountByEmail(email);

        if (account == null) {
            account = this.accountService.createAccountFromOAuth2User(email, providerName, providerUserId);
        }

        this.accountService.addProviderToAccount(email, providerName, providerUserId);

        UserDTO userDTO = new UserDTO(account.getId(), email, email);

        String token = jwtUtility.generateToken(email, userDTO);

        String refreshToken = tokenRefreshService.generateRefreshToken(email);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:8080")
                .fragment("accessToken=" + token)
                .fragment("refreshToken=" + refreshToken)
                .build().toUriString();

        clearAuthenticationAttributes(request);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);

    }

}
