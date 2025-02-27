package com.gateway.backend.service;

import com.gateway.backend.model.Alarm;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AlarmService {
    
    private final List<Alarm> mockAlarms;
    private final Map<String, List<String>> alarmOptions;
    
    public AlarmService() {
        this.mockAlarms = generateMockAlarms();
        this.alarmOptions = generateAlarmOptions();
    }
    
    public List<Alarm> getAlarms(Map<String, String> filters, int page, int pageSize, String sortBy, String sortOrder) {
        List<Alarm> filteredAlarms = new ArrayList<>(mockAlarms);
        
        // Apply filters
        for (Map.Entry<String, String> filter : filters.entrySet()) {
            String key = filter.getKey();
            String value = filter.getValue();
            
            if (value != null && !value.isEmpty()) {
                filteredAlarms = filteredAlarms.stream()
                    .filter(alarm -> {
                        String alarmValue = getAlarmPropertyValue(alarm, key);
                        return alarmValue != null && alarmValue.toLowerCase().contains(value.toLowerCase());
                    })
                    .collect(Collectors.toList());
            }
        }
        
        // Apply sorting
        if (sortBy != null && !sortBy.isEmpty()) {
            int sortMultiplier = "desc".equalsIgnoreCase(sortOrder) ? -1 : 1;
            
            filteredAlarms.sort((a, b) -> {
                String aValue = getAlarmPropertyValue(a, sortBy);
                String bValue = getAlarmPropertyValue(b, sortBy);
                
                if (aValue == null) return sortMultiplier * -1;
                if (bValue == null) return sortMultiplier;
                
                if (sortBy.equals("timestamp")) {
                    return sortMultiplier * a.getTimestamp().compareTo(b.getTimestamp());
                }
                
                return sortMultiplier * aValue.compareTo(bValue);
            });
        }
        
        // Apply pagination
        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, filteredAlarms.size());
        
        if (start >= filteredAlarms.size()) {
            return new ArrayList<>();
        }
        
        return filteredAlarms.subList(start, end);
    }
    
    public int getTotalAlarms(Map<String, String> filters) {
        List<Alarm> filteredAlarms = new ArrayList<>(mockAlarms);
        
        // Apply filters
        for (Map.Entry<String, String> filter : filters.entrySet()) {
            String key = filter.getKey();
            String value = filter.getValue();
            
            if (value != null && !value.isEmpty()) {
                filteredAlarms = filteredAlarms.stream()
                    .filter(alarm -> {
                        String alarmValue = getAlarmPropertyValue(alarm, key);
                        return alarmValue != null && alarmValue.toLowerCase().contains(value.toLowerCase());
                    })
                    .collect(Collectors.toList());
            }
        }
        
        return filteredAlarms.size();
    }
    
    public List<String> getCallTypes() {
        return alarmOptions.get("callTypes");
    }
    
    public List<String> getCarriers() {
        return alarmOptions.get("carriers");
    }
    
    public List<String> getStatuses() {
        return alarmOptions.get("statuses");
    }
    
    public List<String> getSuggestions(String field, String query, int limit) {
        return mockAlarms.stream()
            .map(alarm -> getAlarmPropertyValue(alarm, field))
            .filter(Objects::nonNull)
            .filter(value -> value.toLowerCase().contains(query.toLowerCase()))
            .distinct()
            .limit(limit)
            .collect(Collectors.toList());
    }
    
    private String getAlarmPropertyValue(Alarm alarm, String propertyName) {
        switch (propertyName.toLowerCase()) {
            case "id": return String.valueOf(alarm.getId());
            case "gatewayid": return String.valueOf(alarm.getGatewayId());
            case "gatewayname": return alarm.getGatewayName();
            case "type": return alarm.getType();
            case "severity": return alarm.getSeverity();
            case "message": return alarm.getMessage();
            case "status": return alarm.getStatus();
            case "calltype": return alarm.getCallType();
            case "carrier": return alarm.getCarrier();
            case "siteid": return String.valueOf(alarm.getSiteId());
            case "sitename": return alarm.getSiteName();
            case "caller_number": return alarm.getCaller_number();
            case "callee_number": return alarm.getCallee_number();
            default: return null;
        }
    }
    
    private List<Alarm> generateMockAlarms() {
        List<Alarm> alarms = new ArrayList<>();

        String[] types = {"Connection Lost", "Power Failure", "Hardware Error", "Configuration Error", "Security Alert"};
        String[] severities = {"Low", "Medium", "High", "Critical"};
        String[] statuses = {"Open", "In Progress", "Resolved", "Closed"};
        String[] callTypes = {"SMS", "Voice", "Email", "None"};
        String[] carriers = {"AT&T", "Verizon", "T-Mobile", "Sprint", "Other"};
        String[] messages = {
            "Gateway connection lost",
            "Power supply failure detected",
            "Hardware component malfunction",
            "Invalid configuration settings",
            "Unauthorized access attempt detected",
            "Memory usage exceeds threshold",
            "CPU usage exceeds threshold",
            "Disk space low",
            "Network interface error",
            "Software update failed"
        };

        for (int i = 1; i <= 100; i++) {
            Long id = (long) i;
            Long gatewayId = (long) i;
            Long siteId = (long) i;
            
            // For the new requirements
            String callType = callTypes[i % callTypes.length];
            boolean isMissed = i % 5 == 0; // Every 5th alarm will be a missed call
            String carrier = i % 3 == 0 ? carriers[i % carriers.length] : null;
            
            alarms.add(Alarm.builder()
                    .id(id)
                    .gatewayId(gatewayId)
                    .gatewayName("Gateway " + (i % 50 + 1))
                    .type(types[i % types.length])
                    .severity(severities[i % severities.length])
                    .message(messages[i % messages.length])
                    .timestamp(LocalDateTime.now().minusDays(i % 30).minusHours(i % 24))
                    .status(isMissed ? "Failed" : statuses[i % statuses.length])
                    .callType(callType)
                    .carrier(carrier)
                    .siteId(siteId)
                    .siteName("Site " + (i % 20 + 1))
                    .caller("User " + (i % 10 + 1))
                    // New fields as per requirements
                    .caller_number(generateRandomPhone())
                    .callee_number(generateRandomPhone())
                    .duration_seconds(isMissed ? 0 : new Random().nextInt(3600)) // Max 1 hour
                    .charge_amount(isMissed ? 0.0 : Math.round(new Random().nextDouble() * 10.0 * 100.0) / 100.0) // Max $10 with 2 decimal places
                    .build());
        }
        
        return alarms;
    }
    
    /**
     * Generates a random phone number in the format XXX-XXX-XXXX
     */
    private String generateRandomPhone() {
        Random random = new Random();
        
        int area = 100 + random.nextInt(900);
        int prefix = 100 + random.nextInt(900);
        int lineNum = 1000 + random.nextInt(9000);
        
        return area + "-" + prefix + "-" + lineNum;
    }
    
    private Map<String, List<String>> generateAlarmOptions() {
        Map<String, List<String>> options = new HashMap<>();
        
        options.put("callTypes", Arrays.asList("SMS", "Voice", "Email", "None"));
        options.put("carriers", Arrays.asList("AT&T", "Verizon", "T-Mobile", "Sprint", "Other"));
        options.put("statuses", Arrays.asList("Open", "In Progress", "Resolved", "Closed"));
        
        return options;
    }
}