package com.gateway.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtTokenValidator tokenValidator;

    public JwtAuthenticationFilter(JwtTokenValidator tokenValidator) {
        this.tokenValidator = tokenValidator;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            logger.info("Processing request to: {} {}", request.getMethod(), request.getRequestURI());
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                logger.info("JWT token found in request");
                if (tokenValidator.validateToken(jwt)) {
                    logger.info("JWT token validated successfully");
                    // Token valido, impostiamo l'autenticazione nel contesto di sicurezza
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        tokenValidator.getClaimsFromToken(jwt).getSubject(),
                        null,
                        new ArrayList<>()
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Authentication set for user: {}", authentication.getName());
                    filterChain.doFilter(request, response);
                    return;
                } else {
                    logger.warn("Invalid token received");
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"error\":\"Token non valido o sessione scaduta\"}");
                    return;
                }
            } else {
                logger.debug("No JWT token found in request");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\":\"Token di autenticazione mancante\"}");
                return;
            }
        } catch (Exception ex) {
            logger.error("Impossibile impostare l'autenticazione utente", ex);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"Errore durante la validazione del token\"}");
            return;
        }
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        logger.info("Authorization header: {}", bearerToken);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            logger.info("Extracted token: {}", token);
            return token;
        }
        return null;
    }
}