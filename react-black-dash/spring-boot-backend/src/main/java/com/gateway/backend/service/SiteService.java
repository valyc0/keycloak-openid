package com.gateway.backend.service;

import com.gateway.backend.model.Site;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SiteService {
    
    private final List<Site> mockSites;
    
    public SiteService() {
        this.mockSites = generateMockSites();
    }
    
    public List<Site> getAllSites() {
        return mockSites;
    }
    
    private List<Site> generateMockSites() {
        List<Site> sites = new ArrayList<>();
        
        String[] cities = {"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", 
                "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", 
                "Fort Worth", "Columbus", "San Francisco", "Charlotte", "Indianapolis", "Seattle"};
                
        String[] states = {"NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "WA", "NC", "IN"};
        
        for (int i = 1; i <= 20; i++) {
            String id = UUID.randomUUID().toString();
            int cityIndex = i % cities.length;
            int stateIndex = i % states.length;
            
            sites.add(Site.builder()
                    .id(id)
                    .name("Site " + i)
                    .address(100 + i + " Main Street")
                    .city(cities[cityIndex])
                    .state(states[stateIndex])
                    .zipCode(String.format("%05d", 10000 + i * 100))
                    .country("USA")
                    .latitude(40.0 + (i / 10.0))
                    .longitude(-74.0 - (i / 10.0))
                    .build());
        }
        
        return sites;
    }
}