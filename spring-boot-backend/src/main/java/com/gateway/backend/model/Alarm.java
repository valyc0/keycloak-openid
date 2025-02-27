package com.gateway.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Entity
public class Alarm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long gatewayId;
    private String gatewayName;
    private String type;
    private String severity;
    private String message;
    private LocalDateTime timestamp;
    private String status;
    private String callType;
    private String carrier;
    private Long siteId;
    private String siteName;
    private String caller;
    
    // New fields as per requirements
    private String caller_number;
    private String callee_number;
    private int duration_seconds;
    private double charge_amount;
}