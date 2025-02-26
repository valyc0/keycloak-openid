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
public class Alarm {
    private String id;
    private String gatewayId;
    private String gatewayName;
    private String type;
    private String severity;
    private String message;
    private LocalDateTime timestamp;
    private String status;
    private String callType;
    private String carrier;
    private String siteId;
    private String siteName;
    private String caller;
    
    // New fields as per requirements
    private String caller_number;
    private String callee_number;
    private int duration_seconds;
    private double charge_amount;
}