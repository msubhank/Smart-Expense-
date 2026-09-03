package com.smartexpense.controller;

import com.smartexpense.security.AuthenticatedUser;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Controller exposing public health checks and protected authentication verification endpoints.
 */
@RestController
@RequestMapping("/api")
public class AuthController {

    /**
     * Public health-check endpoint (no authentication required).
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "smart-expense-backend",
            "timestamp", Instant.now().toString()
        ));
    }

    /**
     * Protected endpoint returning the verified user's claims from the Firebase ID token.
     */
    @GetMapping("/auth/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal AuthenticatedUser user) {
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized",
                "message", "No authenticated user principal found in SecurityContext."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "status", "AUTHENTICATED",
            "uid", user.getUid(),
            "email", user.getEmail() != null ? user.getEmail() : "",
            "name", user.getName() != null ? user.getName() : "",
            "pictureUrl", user.getPictureUrl() != null ? user.getPictureUrl() : "",
            "emailVerified", user.isEmailVerified(),
            "timestamp", Instant.now().toString()
        ));
    }
}
