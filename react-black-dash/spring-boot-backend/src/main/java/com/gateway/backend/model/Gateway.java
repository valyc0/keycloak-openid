package com.gateway.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Gateway {
    private String id;
    private String name;
    private String serial;
    private String model;
    private String firmware;
    private String ip;
    private String status;
    private String siteId;
    private String siteName;
    private LocalDateTime lastConnection;
    private Boolean isConfigured;
    private String callType;
    private String carrier;
}