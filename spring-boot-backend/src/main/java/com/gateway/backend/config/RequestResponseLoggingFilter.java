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

        try {
            // Log request details before processing
            logRequest(requestWrapper);

            // Proceed with filter chain
            filterChain.doFilter(requestWrapper, responseWrapper);

            // Log response details after processing
            logResponse(responseWrapper);

            // Copy content back to response
            responseWrapper.copyBodyToResponse();
        } catch (Exception e) {
            logger.error("Error in request/response logging", e);
            throw e;
        }

        // Copy content back to response
        responseWrapper.copyBodyToResponse();
    }

    private void logRequest(ContentCachingRequestWrapper request) {
       String queryString = request.getQueryString() != null ? "?" + request.getQueryString() : "";
       String method = request.getMethod();
       String path = request.getRequestURI() + queryString;
       
       // Log request headers
       String headers = Collections.list(request.getHeaderNames())
               .stream()
               .map(headerName -> "\n\t" + headerName + ": " + request.getHeader(headerName))
               .collect(Collectors.joining(""));

       // Log request body
       String body = "";
       try {
           byte[] content = request.getContentAsByteArray();
           body = new String(content, request.getCharacterEncoding());
       } catch (Exception e) {
           logger.warn("Failed to read request body", e);
           body = "[Error reading body]";
       }

       if (body != null && !body.isEmpty() && !body.equals("[Error reading body]")) {
           logger.debug("\n[REQUEST] {} {}\nHeaders:{}\nBody: {}",
               method, path, headers, formatJson(body));
       } else {
           logger.debug("\n[REQUEST] {} {}\nHeaders:{}",
               method, path, headers);
       }
   }

   private void logResponse(ContentCachingResponseWrapper response) {
       try {
           int status = response.getStatus();
           String contentType = response.getContentType();
           
           // Log response headers
           String headers = response.getHeaderNames()
                   .stream()
                   .map(headerName -> "\n\t" + headerName + ": " + response.getHeader(headerName))
                   .collect(Collectors.joining(""));

           // Log response body
           String body = "";
           try {
               byte[] content = response.getContentAsByteArray();
               body = new String(content, response.getCharacterEncoding());
           } catch (Exception e) {
               logger.warn("Failed to read response body", e);
               body = "[Error reading body]";
           }
           
           if (body != null && !body.isEmpty() && !body.equals("[Error reading body]")) {
               logger.debug("\n[RESPONSE] Status: {} - Content-Type: {}\nHeaders:{}\nBody: {}",
                   status, contentType, headers, formatJson(body));
           } else {
               logger.debug("\n[RESPONSE] Status: {} - Content-Type: {}\nHeaders:{}",
                   status, contentType, headers);
           }
       } catch (Exception e) {
           logger.error("Error logging response", e);
       }
    }

    private String formatJson(String content) {
        if (content == null || content.isEmpty()) {
            return content;
        }
        
        try {
            if (content.startsWith("{") || content.startsWith("[")) {
                return "\n\t" + content
                    .replace(",\"", ",\n\t\"")  // Break after commas before quotes
                    .replace("{", "{\n\t")      // Break after opening braces
                    .replace("}", "\n}")        // Break before closing braces
                    .replace("[", "[\n\t")      // Break after opening brackets
                    .replace("]", "\n]")        // Break before closing brackets
                    .replace("\n\n", "\n");     // Remove double line breaks
            }
        } catch (Exception e) {
            logger.warn("Failed to format JSON content", e);
        }
        return content;
    }
}