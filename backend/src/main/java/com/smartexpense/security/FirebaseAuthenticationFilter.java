package com.smartexpense.security;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter that intercepts incoming HTTP requests, extracts the Firebase ID token
 * from the Authorization header, verifies it, and populates the SecurityContext.
 */
@Component
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith(BEARER_PREFIX)) {
            String token = authHeader.substring(BEARER_PREFIX.length()).trim();

            if (FirebaseApp.getApps().isEmpty()) {
                log.warn("Blocked request: Firebase Admin SDK is not initialized. serviceAccountKey.json is missing.");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Firebase Admin SDK is not configured on the server. Please provide serviceAccountKey.json in src/main/resources.\"}");
                return;
            }

            try {
                FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                AuthenticatedUser user = AuthenticatedUser.builder()
                        .uid(decodedToken.getUid())
                        .email(decodedToken.getEmail())
                        .name(decodedToken.getName())
                        .pictureUrl(decodedToken.getPicture())
                        .emailVerified(decodedToken.isEmailVerified())
                        .build();

                FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(user, token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Successfully authenticated Firebase user: {}", user.getEmail());
            } catch (Exception e) {
                log.error("Firebase ID token verification failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or expired Firebase ID token.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
