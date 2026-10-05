-- =============================================================================
-- SALESTORM SYSTEM DESIGN HACKATHON - SUPABASE / POSTGRESQL DDL MIGRATION
-- Database Schema, Constraints, Indexes, & Atomic Concurrency Stored Procedures
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORY TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCT TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(category_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    sku VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. INVENTORY TABLE (CONCURRENCY CRITICAL)
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID UNIQUE NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    available_quantity INT NOT NULL CHECK (available_quantity >= 0),
    reserved_quantity INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    sold_quantity INT NOT NULL DEFAULT 0 CHECK (sold_quantity >= 0),
    version BIGINT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CUSTOMER TABLE
CREATE TABLE IF NOT EXISTS customers (
    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INVENTORY_RESERVATION TABLE (CONCURRENCY CRITICAL)
CREATE TABLE IF NOT EXISTS inventory_reservations (
    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID NOT NULL REFERENCES inventory(inventory_id),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    product_id UUID NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    status VARCHAR(30) NOT NULL DEFAULT 'RESERVED' 
        CHECK (status IN ('RESERVED', 'PAYMENT_PENDING', 'CONFIRMED', 'RELEASED', 'EXPIRED')),
    expires_at TIMESTAMPTZ NOT NULL,
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CART & CART_ITEM
CREATE TABLE IF NOT EXISTS carts (
    cart_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID UNIQUE NOT NULL REFERENCES customers(customer_id),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER & ORDER_ITEM
CREATE TABLE IF NOT EXISTS orders (
    order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    reservation_id UUID UNIQUE NOT NULL REFERENCES inventory_reservations(reservation_id),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED'
        CHECK (status IN ('CREATED', 'PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED')),
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- 8. PAYMENT TABLE
CREATE TABLE IF NOT EXISTS payments (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(order_id),
    reservation_id UUID NOT NULL REFERENCES inventory_reservations(reservation_id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'TIMED_OUT', 'REFUNDED')),
    transaction_ref VARCHAR(128),
    idempotency_key VARCHAR(128) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROMOTIONS / COUPONS
CREATE TABLE IF NOT EXISTS sales_promotions (
    promotion_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2) DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ
);

-- 10. SHIPMENT TABLE
CREATE TABLE IF NOT EXISTS shipments (
    shipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID UNIQUE NOT NULL REFERENCES orders(order_id),
    tracking_number VARCHAR(100) UNIQUE,
    carrier VARCHAR(50) DEFAULT 'SALESTORM Express',
    status VARCHAR(30) NOT NULL DEFAULT 'LABEL_CREATED',
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- 11. NOTIFICATION TABLE
CREATE TABLE IF NOT EXISTS notifications (
    notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(customer_id),
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'QUEUED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR HIGH-PERFORMANCE CONCURRENCY & LOOKUPS
-- =============================================================================
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_idempotency ON inventory_reservations(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_reservations_expiry ON inventory_reservations(expires_at, status) WHERE status = 'RESERVED';
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_idempotency ON payments(idempotency_key);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_idempotency ON orders(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);

-- =============================================================================
-- ATOMIC CONCURRENCY STORED PROCEDURE (SUPABASE RPC)
-- Handles race conditions by performing row-level lock and reservation creation
-- inside a single Postgres transaction. Returns JSON result.
-- =============================================================================
CREATE OR REPLACE FUNCTION reserve_inventory_atomic(
    p_product_id UUID,
    p_customer_id UUID,
    p_quantity INT,
    p_idempotency_key VARCHAR(128),
    p_ttl_minutes INT DEFAULT 15
) RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    v_inventory_id UUID;
    v_available INT;
    v_reservation_id UUID;
    v_existing_reservation JSONB;
BEGIN
    -- 1. Check if idempotency key already processed
    SELECT jsonb_build_object(
        'success', true,
        'reservation_id', reservation_id,
        'status', status,
        'expires_at', expires_at,
        'is_duplicate', true
    ) INTO v_existing_reservation
    FROM inventory_reservations
    WHERE idempotency_key = p_idempotency_key;

    IF v_existing_reservation IS NOT NULL THEN
        RETURN v_existing_reservation;
    END IF;

    -- 2. Lock Inventory Row For Update
    SELECT inventory_id, available_quantity 
    INTO v_inventory_id, v_available
    FROM inventory
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'PRODUCT_NOT_FOUND');
    END IF;

    -- 3. Check Availability
    IF v_available < p_quantity THEN
        RETURN jsonb_build_object('success', false, 'error', 'OUT_OF_STOCK', 'available', v_available);
    END IF;

    -- 4. Atomic Stock Decrement & Reserved Increment
    UPDATE inventory
    SET available_quantity = available_quantity - p_quantity,
        reserved_quantity = reserved_quantity + p_quantity,
        version = version + 1,
        updated_at = NOW()
    WHERE inventory_id = v_inventory_id;

    -- 5. Insert Reservation Record
    INSERT INTO inventory_reservations (
        inventory_id, customer_id, product_id, quantity, status, expires_at, idempotency_key
    ) VALUES (
        v_inventory_id, p_customer_id, p_product_id, p_quantity, 'RESERVED', 
        NOW() + (p_ttl_minutes || ' minutes')::INTERVAL, p_idempotency_key
    ) RETURNING reservation_id INTO v_reservation_id;

    -- 6. Return Success Response
    RETURN jsonb_build_object(
        'success', true,
        'reservation_id', v_reservation_id,
        'status', 'RESERVED',
        'expires_at', NOW() + (p_ttl_minutes || ' minutes')::INTERVAL,
        'is_duplicate', false
    );
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- =============================================================================
-- EXPIRED RESERVATION RELEASE WORKER (SUPABASE RPC)
-- Reclaims locked stock from unpaid / abandoned reservations
-- =============================================================================
CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS INT LANGUAGE plpgsql AS $$
DECLARE
    v_rec RECORD;
    v_count INT := 0;
BEGIN
    FOR v_rec IN 
        SELECT reservation_id, inventory_id, quantity 
        FROM inventory_reservations
        WHERE status = 'RESERVED' AND expires_at < NOW()
        FOR UPDATE SKIP LOCKED
    LOOP
        -- Return reserved quantity to available pool
        UPDATE inventory
        SET available_quantity = available_quantity + v_rec.quantity,
            reserved_quantity = reserved_quantity - v_rec.quantity,
            updated_at = NOW()
        WHERE inventory_id = v_rec.inventory_id;

        -- Mark reservation as EXPIRED
        UPDATE inventory_reservations
        SET status = 'EXPIRED'
        WHERE reservation_id = v_rec.reservation_id;

        v_count := v_count + 1;
    END LOOP;

    RETURN v_count;
END;
$$;
