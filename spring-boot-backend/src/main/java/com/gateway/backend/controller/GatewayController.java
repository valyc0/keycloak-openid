package com.gateway.backend.controller;

import com.gateway.backend.model.Gateway;
import com.gateway.backend.service.GatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/gateways")
public class GatewayController {

    private final GatewayService gatewayService;

    @Autowired
    public GatewayController(GatewayService gatewayService) {
        this.gatewayService = gatewayService;
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchGateways(
            @RequestParam(required = false, defaultValue = "") String query,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "name") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        
        List<Gateway> gateways = gatewayService.searchGateways(query, page, pageSize, sortBy, sortOrder);
        int total = gatewayService.getTotalGateways(query);
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", gateways);
        response.put("total", total);
        response.put("page", page);
        response.put("pageSize", pageSize);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateGatewayParameters(@RequestBody Object parameters) {
        Map<String, String> validationResults = gatewayService.validateGatewayParameters(parameters);
        boolean isValid = "success".equals(validationResults.get("status"));

        Map<String, Object> response = new HashMap<>();
        response.put("valid", isValid);

        if (!isValid) {
            // In a real application, we would return actual errors
            // For this mock, we're always returning valid=true, so this is placeholder
            response.put("errors", new HashMap<>());
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/configure")
    public ResponseEntity<Map<String, Object>> saveGatewayConfiguration(@RequestBody Object config) {
        boolean success = gatewayService.saveGatewayConfiguration(config);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", "Configuration saved successfully");
        
        return ResponseEntity.ok(response);
    }
}