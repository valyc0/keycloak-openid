package com.gateway.backend.service;

import com.gateway.backend.model.Meter;
import com.gateway.backend.model.MeterParameter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class MeterService {
    
    private final List<Meter> mockMeters;
    private List<MeterParameter> mockParameters;
    
    public MeterService() {
        this.mockMeters = generateMockMeters();
        this.mockParameters = generateAllMockParameters();
    }
    
    public List<Meter> getAllMeters() {
        return mockMeters;
    }
    
    public List<MeterParameter> getAllParameters(Long meterId) {
        if (meterId == null) {
            System.out.println("Returning all mock parameters");
            return mockParameters;
        } else {
            List<MeterParameter> filteredList = mockParameters.stream()
                    .filter(parameter -> meterId.equals(parameter.getMeterId()))
                    .collect(Collectors.toList());
            System.out.println("Returning filtered list for meterId: " + meterId + ", list: " + filteredList);
            return filteredList;
        }
    }
    
    private List<Meter> generateMockMeters() {
        List<Meter> meters = new ArrayList<>();
        
        String[] types = {"Electric", "Gas", "Water", "Temperature", "Pressure"};
        String[] protocols = {"Modbus", "BACnet", "MQTT", "SNMP", "OPC-UA"};
        String[] manufacturers = {"Schneider Electric", "Siemens", "Honeywell", "Johnson Controls", "ABB", "GE"};
        
        for (int i = 1; i <= 15; i++) {
            meters.add(Meter.builder()
                    .id((long) i)
                    .name("Meter " + i)
                    .type(types[i % types.length])
                    .protocol(protocols[i % protocols.length])
                    .manufacturer(manufacturers[i % manufacturers.length])
                    .model("Model-" + (i % 5 + 1))
                    .serialNumber("M" + String.format("%05d", i))
                    .build());
        }
        
        return meters;
    }
    
    private List<MeterParameter> generateMockParameters(Long meterId) {
        List<MeterParameter> parameters = new ArrayList<>();
        
        // Common parameters
        parameters.add(MeterParameter.builder()
                .id(1)
                .meterId(meterId)
                .name("Device Address")
                .description("Physical or logical address for the meter")
                .type("number")
                .defaultValue("123")
                .required(true)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(2)
                .meterId(meterId)
                .name("Poll Rate")
                .description("How often to poll this device (seconds)")
                .type("number")
                .defaultValue("60")
                .required(true)
                .min(5)
                .max(3600)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(3)
                .meterId(meterId)
                .name("Timeout")
                .description("Communication timeout in seconds")
                .type("number")
                .defaultValue("10")
                .required(true)
                .min(1)
                .max(60)
                .build());
        
        // Protocol specific parameters
        parameters.add(MeterParameter.builder()
                .id(4)
                .meterId(meterId)
                .name("Baud Rate")
                .description("Serial communication speed")
                .type("select")
                .defaultValue("9600")
                .required(true)
                .options(new String[]{"4800", "9600", "19200", "38400", "57600", "115200"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(5)
                .meterId(meterId)
                .name("Parity")
                .description("Error detection method")
                .type("select")
                .defaultValue("none")
                .required(true)
                .options(new String[]{"none", "odd", "even"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(6)
                .meterId(meterId)
                .name("Data Bits")
                .description("Number of data bits")
                .type("select")
                .defaultValue("8")
                .required(true)
                .options(new String[]{"7", "8"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(7)
                .meterId(meterId)
                .name("Stop Bits")
                .description("Number of stop bits")
                .type("select")
                .defaultValue("1")
                .required(true)
                .options(new String[]{"1", "2"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(8)
                .meterId(meterId)
                .name("IP Address")
                .description("Network address for TCP communication")
                .type("text")
                .defaultValue("192.168.1.100")
                .required(false)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id(9)
                .meterId(meterId)
                .name("Port")
                .description("Network port for TCP communication")
                .type("number")
                .defaultValue("502")
                .required(false)
                .min(1)
                .max(65535)
                .build());
        
        return parameters;
    }

    private List<MeterParameter> generateAllMockParameters() {
        List<MeterParameter> allParameters = new ArrayList<>();
        for (Meter meter : mockMeters) {
            allParameters.addAll(generateMockParameters(meter.getId()));
        }
        return allParameters;
    }
}