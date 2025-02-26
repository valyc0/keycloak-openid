package com.gateway.backend.service;

import com.gateway.backend.model.Meter;
import com.gateway.backend.model.MeterParameter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MeterService {
    
    private final List<Meter> mockMeters;
    private final List<MeterParameter> mockParameters;
    
    public MeterService() {
        this.mockMeters = generateMockMeters();
        this.mockParameters = generateMockParameters();
    }
    
    public List<Meter> getAllMeters() {
        return mockMeters;
    }
    
    public List<MeterParameter> getAllParameters() {
        return mockParameters;
    }
    
    private List<Meter> generateMockMeters() {
        List<Meter> meters = new ArrayList<>();
        
        String[] types = {"Electric", "Gas", "Water", "Temperature", "Pressure"};
        String[] protocols = {"Modbus", "BACnet", "MQTT", "SNMP", "OPC-UA"};
        String[] manufacturers = {"Schneider Electric", "Siemens", "Honeywell", "Johnson Controls", "ABB", "GE"};
        
        for (int i = 1; i <= 15; i++) {
            String id = UUID.randomUUID().toString();
            
            meters.add(Meter.builder()
                    .id(id)
                    .name("Meter " + i)
                    .type(types[i % types.length])
                    .protocol(protocols[i % protocols.length])
                    .manufacturer(manufacturers[i % manufacturers.length])
                    .build());
        }
        
        return meters;
    }
    
    private List<MeterParameter> generateMockParameters() {
        List<MeterParameter> parameters = new ArrayList<>();
        
        // Common parameters
        parameters.add(MeterParameter.builder()
                .id("address")
                .name("Device Address")
                .description("Physical or logical address for the meter")
                .type("text")
                .defaultValue("")
                .required(true)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("pollRate")
                .name("Poll Rate")
                .description("How often to poll this device (seconds)")
                .type("number")
                .defaultValue("60")
                .required(true)
                .min(5)
                .max(3600)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("timeout")
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
                .id("baudRate")
                .name("Baud Rate")
                .description("Serial communication speed")
                .type("select")
                .defaultValue("9600")
                .required(true)
                .options(new String[]{"4800", "9600", "19200", "38400", "57600", "115200"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("parity")
                .name("Parity")
                .description("Error detection method")
                .type("select")
                .defaultValue("none")
                .required(true)
                .options(new String[]{"none", "odd", "even"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("dataBits")
                .name("Data Bits")
                .description("Number of data bits")
                .type("select")
                .defaultValue("8")
                .required(true)
                .options(new String[]{"7", "8"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("stopBits")
                .name("Stop Bits")
                .description("Number of stop bits")
                .type("select")
                .defaultValue("1")
                .required(true)
                .options(new String[]{"1", "2"})
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("ipAddress")
                .name("IP Address")
                .description("Network address for TCP communication")
                .type("text")
                .defaultValue("192.168.1.100")
                .required(false)
                .build());
                
        parameters.add(MeterParameter.builder()
                .id("port")
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
}