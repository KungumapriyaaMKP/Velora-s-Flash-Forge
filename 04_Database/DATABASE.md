# Velora's Flash Forge — Stage 4: Data & Database Design

> **Project Name**: Velora's Flash Forge  
> **Hackathon**: SALESTORM System Design Challenge 2026

---

## 1. Relational Entity-Relationship (ER) Diagram

![Database ER Diagram](../diagrams/06_er_diagram.jpg)

```mermaid
erDiagram
    CUSTOMER ||--o{ INVENTORY_RESERVATION : places
    CUSTOMER ||--o{ ORDER : owns
    CUSTOMER ||--o{ CART : has
    PRODUCT ||--|| INVENTORY : maintains
    PRODUCT ||--o{ INVENTORY_RESERVATION : reserved_in
    PRODUCT ||--o{ ORDER_ITEM : contained_in
    CATEGORY ||--o{ PRODUCT : categorizes
    INVENTORY ||--o{ INVENTORY_RESERVATION : tracks
    INVENTORY_RESERVATION ||--o| ORDER : converts_to
    ORDER ||--|| PAYMENT : paid_via
    ORDER ||--o{ ORDER_ITEM : includes
    ORDER ||--o| SHIPMENT : fulfilled_by
    CUSTOMER ||--o{ NOTIFICATION : receives

    CUSTOMER {
        uuid customer_id PK
        string full_name
        string email UK
        string phone
        timestamp created_at
    }

    PRODUCT {
        uuid product_id PK
        uuid category_id FK
        string name
        decimal price
        string sku UK
    }

    INVENTORY {
        uuid inventory_id PK
        uuid product_id FK, UK
        int available_quantity
        int reserved_quantity
        int sold_quantity
        bigint version
        timestamp updated_at
    }

    INVENTORY_RESERVATION {
        uuid reservation_id PK
        uuid inventory_id FK
        uuid customer_id FK
        uuid product_id FK
        int quantity
        string status
        timestamp expires_at
        string idempotency_key UK
        timestamp created_at
    }

    ORDER {
        uuid order_id PK
        uuid customer_id FK
        uuid reservation_id FK, UK
        decimal total_amount
        string status
        string idempotency_key UK
        timestamp created_at
    }

    PAYMENT {
        uuid payment_id PK
        uuid order_id FK
        uuid reservation_id FK
        decimal amount
        string status
        string transaction_ref
        string idempotency_key UK
        timestamp created_at
    }
```

---

## 2. Supabase PostgreSQL Choice & Concurrency Defense

### Why Supabase PostgreSQL over MongoDB / NoSQL?
1. **Engine-Level Row Locking (`SELECT FOR UPDATE`)**: Guarantees that even under 10,000 concurrent updates on Product X, PostgreSQL serializes requests at the row level.
2. **Atomic Stored Procedure (`reserve_inventory_atomic`)**: Combines availability check, stock decrement, version increment, and reservation insertion into a single ACID transaction block.
3. **Database Constraints (`CHECK available_quantity >= 0`)**: Prevents negative stock at the engine layer regardless of application bugs.
4. **PgBouncer Connection Pooling**: Prevents database thread starvation during 10k request traffic surges.
