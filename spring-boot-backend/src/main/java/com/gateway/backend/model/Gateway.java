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
public class Gateway {
    @Id
    private Long id;
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