package com.gateway.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meter {
    private String id;
    private String name;
    private String type;
    private String protocol;
    private String manufacturer;
}