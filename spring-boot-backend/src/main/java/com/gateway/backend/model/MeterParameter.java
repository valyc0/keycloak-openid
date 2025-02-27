package com.gateway.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class MeterParameter {
    private Integer id;
    private String meterId;
    private String name;
    private String description;
    private String type; // text, number, select, etc.
    private String defaultValue;
    private Boolean required;
    private Integer min;
    private Integer max;
    private String[] options;

    public String getMeterId() {
        return meterId;
    }
}