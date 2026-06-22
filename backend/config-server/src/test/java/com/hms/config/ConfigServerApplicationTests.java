package com.hms.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        classes = ConfigServerApplication.class,
        properties = {
                "spring.cloud.config.server.git.uri=file:///tmp/hms-config",
                "spring.cloud.config.server.git.clone-on-start=false",
                "eureka.client.enabled=false"
        }
)
class ConfigServerApplicationTests {

    @Test
    void contextLoads() {
    }
}
