package com.hms.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
        classes = ApiGatewayApplication.class,
        properties = {
                "jwt.secret=12345678901234567890123456789012",
                "eureka.client.enabled=false"
        }
)
class ApiGatewayApplicationTests {

    @Test
    void contextLoads() {
    }
}
