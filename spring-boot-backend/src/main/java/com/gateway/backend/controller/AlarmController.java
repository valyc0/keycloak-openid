package com.gateway.backend.controller;

import com.gateway.backend.model.Alarm;
import com.gateway.backend.service.AlarmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alarms")
public class AlarmController {

    private final AlarmService alarmService;

    @Autowired
    public AlarmController(AlarmService alarmService) {
        this.alarmService = alarmService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAlarms(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "timestamp") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam Map<String, String> allParams) {
        
        // Remove pagination and sorting parameters from filters
        Map<String, String> filters = new HashMap<>(allParams);
        filters.remove("page");
        filters.remove("pageSize");
        filters.remove("sortBy");
        filters.remove("sortOrder");
        
        List<Alarm> alarms = alarmService.getAlarms(filters, page, pageSize, sortBy, sortOrder);
        int total = alarmService.getTotalAlarms(filters);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", alarms);
        response.put("total", total);
        response.put("page", page);
        response.put("pageSize", pageSize);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/call-types")
    public ResponseEntity<List<String>> getCallTypes() {
        return ResponseEntity.ok(alarmService.getCallTypes());
    }

    @GetMapping("/carriers")
    public ResponseEntity<List<String>> getCarriers() {
        return ResponseEntity.ok(alarmService.getCarriers());
    }

    @GetMapping("/statuses")
    public ResponseEntity<List<String>> getStatuses() {
        return ResponseEntity.ok(alarmService.getStatuses());
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(
            @RequestParam String field,
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "5") int limit) {
        return ResponseEntity.ok(alarmService.getSuggestions(field, query, limit));
    }
}