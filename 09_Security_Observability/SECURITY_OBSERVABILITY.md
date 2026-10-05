# SALESTORM — Stage 9: Security & Observability Architecture

## 1. Security Architecture & Threat Mitigation

### 1.1 Authentication & Authorization
- **JWT (JSON Web Tokens)**: Short-lived access tokens (15-minute expiration) signed with RS256 algorithm.
- **RBAC (Role-Based Access Control)**: Enforces permissions for `CUSTOMER`, `STORE_MANAGER`, and `SYSTEM_ADMIN`.

### 1.2 Abuse & Bot Prevention
- **Cloudflare Web Application Firewall (WAF)**: Filters malicious bots, TLS fingerprinting anomalies, and DDoS attacks.
- **Token Bucket Rate Limiting**: Limit per User ID: 5 reservation attempts / minute.

### 1.3 PCI-DSS & Data Protection
- Card details never touch SALESTORM application servers. Frontend uses Stripe Elements / SDK to generate opaque tokens (`tok_12345`).
- Database columns containing sensitive PII (customer email, phone) are encrypted at rest using AES-256.

---

## 2. Observability & Distributed Tracing

### 2.1 Structured Business Event Logging (JSON)
All services emit standardized JSON log formats for ingestion into Elasticsearch / Datadog:

```json
{
  "timestamp": "2026-10-05T09:30:01.123Z",
  "trace_id": "4c987a12b901fe22",
  "span_id": "771a2b90",
  "service": "inventory-service",
  "level": "INFO",
  "event_type": "RESERVATION_SUCCESS",
  "customer_id": "usr_998877",
  "product_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "quantity": 1,
  "remaining_stock": 99,
  "execution_time_ms": 14.2
}
```

### 2.2 Key Prometheus Metrics

1. `salestorm_inventory_available_units{product_id="..."}`: Gauge of remaining stock.
2. `salestorm_reservations_total{status="RESERVED|EXPIRED|RELEASED"}`: Counter of reservation outcomes.
3. `salestorm_payment_requests_total{status="SUCCESS|FAILED"}`: Counter of payment gateway decisions.
4. `salestorm_checkout_latency_seconds_bucket`: Histogram of end-to-end checkout latency.

### 2.3 Critical Alert Definitions
- **Inventory Discrepancy Alert**: Triggered if `available_quantity + reserved_quantity + sold_quantity != initial_total`.
- **Payment Failure Rate Surge**: Triggered if payment failure rate exceeds 10% over a 2-minute rolling window.
- **Kafka Consumer Lag Alert**: Triggered if Order Service consumer lag exceeds 500 uncommitted messages.
