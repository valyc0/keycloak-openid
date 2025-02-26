package com.gateway.backend.controller;

import com.gateway.backend.model.Site;
import com.gateway.backend.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sites")
public class SiteController {

    private final SiteService siteService;

    @Autowired
    public SiteController(SiteService siteService) {
        this.siteService = siteService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSites() {
        List<Site> sites = siteService.getAllSites();
        
        Map<String, Object> response = new HashMap<>();
        response.put("data", sites);
        
        return ResponseEntity.ok(response);
    }
}