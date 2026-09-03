package com.smartexpense.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents the authenticated user principal verified via Firebase ID Token.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatedUser {
    private String uid;
    private String email;
    private String name;
    private String pictureUrl;
    private boolean emailVerified;
}
