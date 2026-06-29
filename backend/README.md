# HMS Backend Microservices

This directory houses the backend infrastructure for the Hospital Management System. It is built as a highly scalable, distributed system using Java, Spring Boot, and Spring Cloud.

## 🏗️ Architecture Overview

The backend employs a microservices architectural pattern. Instead of a single monolithic application, functionality is broken down into small, independent services communicating over the network. 

### Key Characteristics:
- **Service Discovery:** Uses **Netflix Eureka** to allow services to find and communicate with each other dynamically.
- **Centralized Configuration:** Uses **Spring Cloud Config Server** to manage configurations across all environments from a central location (often a Git repository).
- **API Gateway:** All external requests flow through a central **Spring Cloud Gateway**, which handles routing, security, and rate-limiting.
- **Event-Driven:** Asynchronous communication and decoupling are achieved using **Apache Kafka**. Services publish domain events (e.g., `PatientRegisteredEvent`), which are consumed by other interested services (like the Notification Service).
- **Polyglot Persistence (Logical):** While PostgreSQL is used as the central database server, each microservice connects to its own dedicated logical database to ensure data autonomy.

## 📦 Microservices Landscape

| Service Name | Port | Description | DB/Tech |
| :--- | :--- | :--- | :--- |
| **discovery-server** | `8761` | Eureka Server for service registration and discovery. | - |
| **config-server** | `8888` | Provides externalized configuration for all services. | Git-backed |
| **api-gateway** | `8080` | Edge server routing client requests to backend services. | - |
| **auth-service** | `8081` | Manages users, roles, and issues JWT tokens. | PostgreSQL (`auth_db`) |
| **patient-service** | `8082` | Handles patient onboarding, profiles, and history. | PostgreSQL, Redis, Kafka |
| **appointment-service** | `8083` | Manages doctor scheduling and patient appointments. | PostgreSQL, Redis, Kafka |
| **notification-service** | `8084` | Listens to Kafka events to send Emails and SMS. | PostgreSQL, Kafka |
| **billing-service** | `8085` | Manages invoices, payments, and billing records. | PostgreSQL, Kafka |
| **audit-service** | `8086` | Centralized auditing of system-wide actions/events. | PostgreSQL, Kafka |
| **analytics-service** | `8087` | Aggregates data for reporting and dashboards. | PostgreSQL, Redis, Kafka |

*(Additional domain services include doctor, pharmacy, laboratory, admission, inventory, and reporting).*

## 🛠️ Technology Stack

- **Java 21:** Utilizing modern Java features like virtual threads and records.
- **Spring Boot 3.5.0:** Core framework for building production-ready applications.
- **Spring Cloud (2025.0.0):** Microservices tooling.
- **Lombok:** Reduces boilerplate code (Getters, Setters, Builders).
- **MapStruct:** Code generator that greatly simplifies mapping between Java bean types (e.g., Entity to DTO).
- **PostgreSQL 16:** Relational database management.
- **Redis 7:** High-performance caching layer.
- **Apache Kafka 7.6.1:** Distributed event streaming platform.

## 🚀 Development Guide

### Prerequisites
- JDK 21
- Maven (or use the included `mvnw` wrapper)
- A running instance of Postgres, Redis, and Kafka (easily spun up using the root `docker-compose.yml`).

### Running Locally

You can run individual microservices locally for development. It is crucial to start the infrastructure and core services in the correct order.

1. **Start Infrastructure (from root directory)**
   ```bash
   # Starts Postgres, Redis, Kafka, Zookeeper
   docker-compose up -d postgres redis zookeeper kafka
   ```

2. **Start Core Services**
   In your IDE (IntelliJ IDEA / Eclipse / VS Code), start the following applications in order:
   - `DiscoveryServerApplication` (Wait for it to start fully on 8761)
   - `ConfigServerApplication` (Wait for it to start on 8888)
   - `ApiGatewayApplication` (Wait for it to start on 8080)

3. **Start Domain Services**
   Once the core infrastructure is running, you can start any domain service you are working on, for example, `AuthServiceApplication` or `PatientServiceApplication`.

### Build Project

To compile and package the entire backend project:
```bash
./mvnw clean install -DskipTests
```
*(Use `mvnw.cmd` on Windows)*

## 🔐 Security (JWT)

Security is handled via the API Gateway and Auth Service. 
1. The user authenticates via `auth-service`.
2. The `auth-service` issues a signed JSON Web Token (JWT).
3. The client includes this JWT in the `Authorization: Bearer <token>` header for subsequent requests.
4. The `api-gateway` validates the JWT signature before routing the request to downstream services. Downstream services trust the Gateway.
