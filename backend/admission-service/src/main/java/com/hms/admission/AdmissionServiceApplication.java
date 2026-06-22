package com.hms.admission;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EnableDiscoveryClient
public class AdmissionServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdmissionServiceApplication.class, args);
    }
}