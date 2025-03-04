package com.gateway.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.auth0.jwk.Jwk;
import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.UrlJwkProvider;
import java.net.URL;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;

@Component
public class JwtTokenValidator {
    private static final Logger logger = LoggerFactory.getLogger(JwtTokenValidator.class);

    @Value("${keycloak.auth-server-url:http://localhost:8080}")
    private String keycloakServerUrl;

    @Value("${keycloak.realm:master}")
    private String realm;

    public boolean validateToken(String token) {
        logger.info("Starting token validation process");
        try {
            // Log del token ricevuto (mascherato per sicurezza)
            String maskedToken = token.substring(0, Math.min(token.length(), 20)) + "...";
            logger.info("Received token (masked): {}", maskedToken);
            
            logger.debug("Validating token structure");
            String[] chunks = token.split("\\.");
            if (chunks.length < 2) {
                logger.error("Invalid token structure: token must have at least 2 parts");
                return false;
            }
            logger.debug("Token structure is valid");

            logger.info("Extracting claims from token");
            Claims claims = getUnverifiedClaims(token);
            
            String expectedIssuer = keycloakServerUrl + "/realms/" + realm;
            logger.info("Validating token issuer. Expected: {}", expectedIssuer);
            if (!expectedIssuer.equals(claims.getIssuer())) {
                logger.error("Invalid token issuer: {}. Expected: {}", claims.getIssuer(), expectedIssuer);
                return false;
            }
            logger.debug("Token issuer is valid");

            logger.info("Retrieving public key from Keycloak");
            PublicKey publicKey = getPublicKey(token);
            logger.debug("Successfully retrieved public key");
            
            logger.info("Verifying token signature");
            Jwts.parser()
                .setSigningKey(publicKey)
                .parseClaimsJws(token);
            logger.info("Token signature verified successfully");

            return true;
        } catch (ExpiredJwtException ex) {
            logger.error("Token validation failed: Token has expired", ex);
        } catch (MalformedJwtException ex) {
            logger.error("Token validation failed: Malformed token", ex);
        } catch (UnsupportedJwtException ex) {
            logger.error("Token validation failed: Unsupported token format", ex);
        } catch (IllegalArgumentException ex) {
            logger.error("Token validation failed: Empty or null token", ex);
        } catch (Exception ex) {
            logger.error("Token validation failed with unexpected error", ex);
        }
        return false;
    }

    public Claims getClaimsFromToken(String token) {
        try {
            PublicKey publicKey = getPublicKey(token);
            return Jwts.parser()
                    .setSigningKey(publicKey)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Errore nell'estrazione dei claims dal token", e);
        }
    }

    private PublicKey getPublicKey(String token) throws Exception {
        logger.debug("Extracting 'kid' from token header");
        String[] chunks = token.split("\\.");
        String headerJson = new String(java.util.Base64.getDecoder().decode(chunks[0]));
        JsonNode headerNode = new ObjectMapper().readTree(headerJson);
        String kid = headerNode.get("kid").asText();
        logger.debug("Extracted kid: {}", kid);

        String jwksUrl = keycloakServerUrl + "/realms/" + realm + "/protocol/openid-connect/certs";
        logger.info("Fetching public key from Keycloak JWKS endpoint: {}", jwksUrl);
        
        JwkProvider provider = new UrlJwkProvider(new URL(jwksUrl));
        logger.debug("JWKS provider initialized");
        
        Jwk jwk = provider.get(kid);
        logger.info("Successfully retrieved JWK for kid: {}", kid);
        
        PublicKey publicKey = jwk.getPublicKey();
        logger.debug("Public key extracted successfully");
        
        return publicKey;
    }

    private Claims getUnverifiedClaims(String token) {
        try {
            String[] chunks = token.split("\\.");
            if (chunks.length < 2) {
                throw new IllegalArgumentException("Token invalido");
            }
            
            // Decodifica base64 del payload
            String payloadJson = new String(java.util.Base64.getDecoder().decode(chunks[1]));
            JsonNode payloadNode = new ObjectMapper().readTree(payloadJson);
            
            logger.info("Token payload: {}", payloadNode.toPrettyString());
            
            CustomClaims claims = new CustomClaims();
            if (payloadNode.has("iss")) {
                claims.setIssuer(payloadNode.get("iss").asText());
            }
            if (payloadNode.has("sub")) {
                claims.setSubject(payloadNode.get("sub").asText());
            }
            if (payloadNode.has("exp")) {
                claims.setExpiration(new Date(payloadNode.get("exp").asLong() * 1000));
            }
            if (payloadNode.has("aud")) {
                claims.setAudience(payloadNode.get("aud").asText());
            }
            if (payloadNode.has("iat")) {
                claims.setIssuedAt(new Date(payloadNode.get("iat").asLong() * 1000));
            }
            return claims;
        } catch (Exception e) {
            throw new IllegalArgumentException("Errore nel parsing del token", e);
        }
    }
}