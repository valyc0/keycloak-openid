package com.gateway.backend.controller;

import com.gateway.backend.model.Meter;
import com.gateway.backend.model.MeterParameter;
import com.gateway.backend.service.MeterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/meters")
public class MeterController {

    private final MeterService meterService;

    @Autowired
    public MeterController(MeterService meterService) {
        this.meterService = meterService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllMeters() {
        List<Meter> meters = meterService.getAllMeters();
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", meters);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/parameters")
    public ResponseEntity<Map<String, Object>> getAllMeterParameters(@RequestParam(value = "meterId", required = false) String meterId) {
        List<MeterParameter> meterParameters;
        if (meterId == null || meterId.isEmpty()) {
            meterParameters = meterService.getAllParameters(null);
        } else {
            meterParameters = meterService.getAllParameters(meterId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("data", meterParameters);

        return ResponseEntity.ok(response);
    }
}