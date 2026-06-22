package com.hms.analytics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@EnableCaching
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class AnalyticsServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyticsServiceApplication.class, args);
    }

}
