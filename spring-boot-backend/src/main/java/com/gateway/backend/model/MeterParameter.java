package com.gateway.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeterParameter {
    private String id;
    private String name;
    private String description;
    private String type; // text, number, select, etc.
    private String defaultValue;
    private Boolean required;
    private Integer min;
    private Integer max;
    private String[] options;
}