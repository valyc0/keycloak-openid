package com.gateway.backend.security;

import io.jsonwebtoken.Claims;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class CustomClaims implements Claims {
    private final Map<String, Object> claims = new HashMap<>();

    @Override
    public int size() {
        return claims.size();
    }

    @Override
    public boolean isEmpty() {
        return claims.isEmpty();
    }

    @Override
    public boolean containsKey(Object key) {
        return claims.containsKey(key);
    }

    @Override
    public boolean containsValue(Object value) {
        return claims.containsValue(value);
    }

    @Override
    public Object remove(Object key) {
        return claims.remove(key);
    }

    @Override
    public void putAll(Map<? extends String, ? extends Object> m) {
        claims.putAll(m);
    }

    @Override
    public void clear() {
        claims.clear();
    }

    @Override
    public Set<String> keySet() {
        return claims.keySet();
    }

    @Override
    public Collection<Object> values() {
        return claims.values();
    }

    @Override
    public Set<Map.Entry<String, Object>> entrySet() {
        return claims.entrySet();
    }

    @Override
    public String getIssuer() {
        return (String) claims.get(ISSUER);
    }

    @Override
    public Claims setIssuer(String iss) {
        claims.put(ISSUER, iss);
        return this;
    }

    @Override
    public String getSubject() {
        return (String) claims.get(SUBJECT);
    }

    @Override
    public Claims setSubject(String sub) {
        claims.put(SUBJECT, sub);
        return this;
    }

    @Override
    public String getAudience() {
        return (String) claims.get(AUDIENCE);
    }

    @Override
    public Claims setAudience(String aud) {
        claims.put(AUDIENCE, aud);
        return this;
    }

    @Override
    public Date getExpiration() {
        return (Date) claims.get(EXPIRATION);
    }

    @Override
    public Claims setExpiration(Date exp) {
        claims.put(EXPIRATION, exp);
        return this;
    }

    @Override
    public Date getNotBefore() {
        return (Date) claims.get(NOT_BEFORE);
    }

    @Override
    public Claims setNotBefore(Date nbf) {
        claims.put(NOT_BEFORE, nbf);
        return this;
    }

    @Override
    public Date getIssuedAt() {
        return (Date) claims.get(ISSUED_AT);
    }

    @Override
    public Claims setIssuedAt(Date iat) {
        claims.put(ISSUED_AT, iat);
        return this;
    }

    @Override
    public String getId() {
        return (String) claims.get(ID);
    }

    @Override
    public Claims setId(String jti) {
        claims.put(ID, jti);
        return this;
    }

    @Override
    public <T> T get(String claimName, Class<T> requiredType) {
        Object value = claims.get(claimName);
        return requiredType.cast(value);
    }

    @Override
    public Object get(Object key) {
        return claims.get(key);
    }

    @Override
    public Object put(String key, Object value) {
        claims.put(key, value);
        return value;
    }
}