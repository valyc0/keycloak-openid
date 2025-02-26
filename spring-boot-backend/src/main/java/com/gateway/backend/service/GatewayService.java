package com.gateway.backend.service;

import com.gateway.backend.model.Gateway;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GatewayService {

    private final List<Gateway> mockGateways;

    public GatewayService() {
        this.mockGateways = generateMockGateways();
    }

    public List<Gateway> searchGateways(String query, int page, int pageSize, String sortBy, String sortOrder) {
        List<Gateway> filteredGateways = mockGateways;
        
        if (query != null && !query.isEmpty() && query.length() >= 3) {
            filteredGateways = filteredGateways.stream()
                .filter(gateway -> 
                    gateway.getName().toLowerCase().contains(query.toLowerCase()) ||
                    gateway.getSerial().toLowerCase().contains(query.toLowerCase()))
                .collect(Collectors.toList());
        }
        
        if (sortBy != null && !sortBy.isEmpty()) {
            int sortMultiplier = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
            
            filteredGateways.sort((a, b) -> {
                switch (sortBy) {
                    case "name":
                        return sortMultiplier * a.getName().compareTo(b.getName());
                    case "serial":
                        return sortMultiplier * a.getSerial().compareTo(b.getSerial());
                    case "model":
                        return sortMultiplier * a.getModel().compareTo(b.getModel());
                    case "status":
                        return sortMultiplier * a.getStatus().compareTo(b.getStatus());
                    case "lastConnection":
                        return sortMultiplier * a.getLastConnection().compareTo(b.getLastConnection());
                    default:
                        return 0;
                }
            });
        }
        
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, filteredGateways.size());
        
        if (start >= filteredGateways.size()) {
            return new ArrayList<>();
        }
        
        return filteredGateways.subList(start, end);
    }
    
    public int getTotalGateways(String query) {
        if (query != null && !query.isEmpty() && query.length() >= 3) {
            return (int) mockGateways.stream()
                .filter(gateway -> 
                    gateway.getName().toLowerCase().contains(query.toLowerCase()) ||
                    gateway.getSerial().toLowerCase().contains(query.toLowerCase()))
                .count();
        }
        return mockGateways.size();
    }
    
    public boolean validateGatewayParameters(Object parameters) {
        // In a real application, this would validate actual parameters
        // For this mock, we always return true
        return true;
    }
    
    public boolean saveGatewayConfiguration(Object config) {
        // In a real application, this would save the configuration
        // For this mock, we always return true
        return true;
    }

    private List<Gateway> generateMockGateways() {
        List<Gateway> gateways = new ArrayList<>();
        
        String[] models = {"GW-1000", "GW-2000", "GW-3000", "GW-4000", "GW-5000"};
        String[] firmwares = {"v1.0.0", "v1.1.0", "v1.2.0", "v2.0.0", "v2.1.0"};
        String[] statuses = {"Online", "Offline", "Warning", "Critical", "Maintenance"};
        String[] callTypes = {"Voice", "Data", "SMS", "MMS", "Video"};
        String[] carriers = {"AT&T", "Verizon", "T-Mobile", "Sprint", "Vodafone", "Orange", "Telefonica"};
        
        for (int i = 1; i <= 50; i++) {
            String id = UUID.randomUUID().toString();
            String siteId = UUID.randomUUID().toString();
            
            gateways.add(Gateway.builder()
                    .id(id)
                    .name("Gateway " + i)
                    .serial("SN-" + (10000 + i))
                    .model(models[i % models.length])
                    .firmware(firmwares[i % firmwares.length])
                    .ip("192.168.1." + i)
                    .status(statuses[i % statuses.length])
                    .siteId(siteId)
                    .siteName("Site " + i)
                    .lastConnection(LocalDateTime.now().minusHours(i % 48))
                    .isConfigured(i % 3 != 0)  // 2/3 of gateways are configured
                    .callType(callTypes[i % callTypes.length])
                    .carrier(carriers[i % carriers.length])
                    .build());
        }
        
        return gateways;
    }
}