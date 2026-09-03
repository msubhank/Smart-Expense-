package com.smartexpense.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

/**
 * Spring Security Authentication token holding the verified AuthenticatedUser.
 */
public class FirebaseAuthenticationToken extends AbstractAuthenticationToken {

    private final AuthenticatedUser principal;
    private final Object credentials;

    public FirebaseAuthenticationToken(AuthenticatedUser principal, Object credentials) {
        super(Collections.emptyList());
        this.principal = principal;
        this.credentials = credentials;
        setAuthenticated(true);
    }

    public FirebaseAuthenticationToken(AuthenticatedUser principal, Object credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.credentials = credentials;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return credentials;
    }

    @Override
    public AuthenticatedUser getPrincipal() {
        return principal;
    }
}
