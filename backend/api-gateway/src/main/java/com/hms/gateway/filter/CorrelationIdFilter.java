package com.hms.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class CorrelationIdFilter implements GlobalFilter {

    public static final String CORRELATION_ID = "X-Correlation-Id";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String correlationId = UUID.randomUUID().toString();

        ServerWebExchange mutatedExchange = exchange.mutate()
                .request(exchange
                .getRequest()
                .mutate()
                .header(CORRELATION_ID, correlationId)
                .build())
                .build();

        mutatedExchange
                .getResponse()
                .getHeaders()
                .set(CORRELATION_ID, correlationId);

        return chain.filter(mutatedExchange);
    }
}
