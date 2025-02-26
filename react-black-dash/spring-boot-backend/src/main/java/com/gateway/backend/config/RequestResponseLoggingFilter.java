package com.gateway.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
@Order(1)
public class RequestResponseLoggingFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestResponseLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Wrap request and response to cache their content
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

        // Log request details
        logRequest(requestWrapper);

        // Proceed with filter chain
        filterChain.doFilter(requestWrapper, responseWrapper);

        // Log response details
        logResponse(responseWrapper);

        // Copy content back to response
        responseWrapper.copyBodyToResponse();
    }

    private void logRequest(ContentCachingRequestWrapper request) {
        String queryString = request.getQueryString() != null ? "?" + request.getQueryString() : "";
        String method = request.getMethod();
        String path = request.getRequestURI() + queryString;
        String headers = Collections.list(request.getHeaderNames())
                .stream()
                .map(headerName -> headerName + ": " + request.getHeader(headerName))
                .collect(Collectors.joining(", "));

        logger.info("[REQUEST] {} {} - Headers: {}", method, path, headers);
    }

    private void logResponse(ContentCachingResponseWrapper response) {
        int status = response.getStatus();
        String contentType = response.getContentType();
        logger.info("[RESPONSE] Status: {} - Content-Type: {}", status, contentType);
    }
}