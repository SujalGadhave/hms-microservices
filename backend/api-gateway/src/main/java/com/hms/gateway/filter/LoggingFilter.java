package com.hms.gateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class LoggingFilter implements GlobalFilter {
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long start = System.currentTimeMillis();

        return chain.filter(exchange)
                .then(Mono.fromRunnable(() -> {
                    long duration = System.currentTimeMillis() - start;
                    log.info(
                            "Request: {} | Status: {} | Duration: {} ms",
                            exchange.getRequest().getURI(),
                            exchange.getResponse().getStatusCode(),
                            duration
                    );
        }));
    }
}
