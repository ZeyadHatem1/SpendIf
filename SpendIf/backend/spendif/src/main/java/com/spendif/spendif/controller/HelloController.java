package com.spendif.spendif.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/api/hello")
    public String saysHello() {
        return "Hello from Spring Boot backend!";
    
    }
}