package com.medistock.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    // Forward all frontend page routes to index.html so React Router handles them
    @GetMapping(value = { 
        "/", 
        "/login", 
        "/register", 
        "/medicines", 
        "/stock", 
        "/billing", 
        "/purchases", 
        "/reports", 
        "/settings" 
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
