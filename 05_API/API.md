# SALESTORM — Stage 5: API & Event Specification

## 1. REST API Specifications

### 1.0 User Authentication Endpoints (AuthN & AuthZ)

#### A. User Registration (`POST /api/auth/signup`)
- **Request Body**:
  ```json
  {
    "fullName": "Alex Morgan",
    "email": "alex@velora.io",
    "password": "Velora@SecurePass2026!",
    "role": "customer"
  }
  ```
- **Responses**:
  - `201 Created`: Returns user profile and session token.
  - `400 Bad Request`: Password fails security policy or duplicate email exists.

#### B. User Login (`POST /api/auth/login`)
- **Request Body**:
  ```json
  {
    "email": "alex@velora.io",
    "password": "Velora@SecurePass2026!"
  }
  ```
- **Responses**:
  - `200 OK`: Returns authenticated user & JWT cookie.
  - `401 Unauthorized`: Invalid credentials. Returns remaining allowed attempts.
  - `423 Locked`: Account locked due to 5 failed attempts (15-minute lockout mutex).

#### C. Session Verification (`GET /api/auth/me`)
- **Headers**: `Authorization: Bearer <TOKEN>` or `velora_auth_token` Cookie.
- **Responses**:
  - `200 OK`: Returns current user details and role.
  - `401 Unauthorized`: Invalid or expired session token.

### 1.1 Reserve Inventory Endpoint
- **HTTP Method**: `POST`
- **Endpoint**: `/api/v1/reservations`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <JWT_TOKEN>`
  - `X-Idempotency-Key: <UUID_V4>` (Mandatory)
- **Request Body**:
  ```json
  {
    "product_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "quantity": 1
  }
  ```
- **Responses**:
  - `201 Created` (Successful reservation):
    ```json
    {
      "success": true,
      "data": {
        "reservation_id": "c71a39f6-281b-4f93-b295-65d1d6a782b1",
        "product_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "status": "RESERVED",
        "quantity": 1,
        "expires_at": "2026-10-05T09:45:00Z"
      }
    }
    ```
  - `409 Conflict` (Out of Stock / Sold Out):
    ```json
    {
      "success": false,
      "error": {
        "code": "OUT_OF_STOCK",
        "message": "Product X has sold out. 0 units available."
      }
    }
    ```
  - `429 Too Many Requests` (Throttled by Rate Limiter):
    ```json
    {
      "success": false,
      "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "Maximum request limit reached. Please retry in 5 seconds."
      }
    }
    ```

---

### 1.2 Checkout & Payment Endpoint
- **HTTP Method**: `POST`
- **Endpoint**: `/api/v1/checkout/pay`
- **Headers**:
  - `Authorization: Bearer <JWT_TOKEN>`
  - `X-Idempotency-Key: <UUID_V4>`
- **Request Body**:
  ```json
  {
    "reservation_id": "c71a39f6-281b-4f93-b295-65d1d6a782b1",
    "payment_method": "STRIPE_CARD",
    "card_token": "tok_visa_flash_sale_123",
    "amount": 299.99
  }
  ```
- **Responses**:
  - `200 OK` (Payment Success & Order Initiated):
    ```json
    {
      "success": true,
      "data": {
        "payment_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "transaction_ref": "ch_3N9xYz2eZvKYLO2C00112233",
        "status": "SUCCESS",
        "order_status": "PAYMENT_PENDING",
        "message": "Payment authorized. Order confirmation pending."
      }
    }
    ```
  - `400 Bad Request` (Payment Failed):
    ```json
    {
      "success": false,
      "error": {
        "code": "PAYMENT_DECLINED",
        "message": "Insufficient funds or card declined.",
        "reservation_status": "RELEASED"
      }
    }
    ```

---

## 2. Asynchronous Event Specification (Kafka Topics)

### Topic: `salestorm.inventory.events`
**Event Name**: `inventory.reserved`
```json
{
  "event_id": "evt_1001",
  "event_type": "INVENTORY_RESERVED",
  "timestamp": "2026-10-05T09:30:00Z",
  "payload": {
    "reservation_id": "c71a39f6-281b-4f93-b295-65d1d6a782b1",
    "customer_id": "usr_998877",
    "product_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "quantity": 1,
    "expires_at": "2026-10-05T09:45:00Z"
  }
}
```

### Topic: `salestorm.payment.events`
**Event Name**: `payment.succeeded`
```json
{
  "event_id": "evt_2002",
  "event_type": "PAYMENT_SUCCEEDED",
  "timestamp": "2026-10-05T09:31:10Z",
  "payload": {
    "payment_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "reservation_id": "c71a39f6-281b-4f93-b295-65d1d6a782b1",
    "customer_id": "usr_998877",
    "amount": 299.99,
    "transaction_ref": "ch_3N9xYz2eZvKYLO2C00112233"
  }
}
```

### Topic: `salestorm.order.events`
**Event Name**: `order.created`
```json
{
  "event_id": "evt_3003",
  "event_type": "ORDER_CREATED",
  "timestamp": "2026-10-05T09:31:12Z",
  "payload": {
    "order_id": "ord_88776655",
    "customer_id": "usr_998877",
    "status": "CONFIRMED",
    "total_amount": 299.99
  }
}
```
