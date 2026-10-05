import fs from 'fs';
import path from 'path';

const diagramsDir = path.join(process.cwd(), 'diagrams');
const frontendPublicDir = path.join(process.cwd(), 'frontend', 'public', 'diagrams');

if (!fs.existsSync(diagramsDir)) fs.mkdirSync(diagramsDir, { recursive: true });
if (!fs.existsSync(frontendPublicDir)) fs.mkdirSync(frontendPublicDir, { recursive: true });

function createSVGWrapper(title, subtitle, contentWidth, contentHeight, bodySVG) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${contentWidth} ${contentHeight}" width="${contentWidth}" height="${contentHeight}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="boxBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8"/>
    </marker>
    <marker id="arrowGreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  
  <!-- Header Banner -->
  <rect x="0" y="0" width="${contentWidth}" height="80" fill="#0f172a"/>
  <line x1="0" y1="80" x2="${contentWidth}" y2="80" stroke="#06b6d4" stroke-width="3"/>
  
  <text x="30" y="38" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="22" font-weight="800" letter-spacing="1">VELORA'S FLASH FORGE</text>
  <text x="30" y="62" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" font-weight="600">${title.toUpperCase()} — ${subtitle}</text>
  <text x="${contentWidth - 240}" y="48" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">SALESTORM SYS DESIGN 2026</text>

  <!-- Diagram Body -->
  <g transform="translate(0, 40)">
    ${bodySVG}
  </g>

  <!-- Footer -->
  <rect x="0" y="${contentHeight - 40}" width="${contentWidth}" height="40" fill="#090d16"/>
  <line x1="0" y1="${contentHeight - 40}" x2="${contentWidth}" y2="${contentHeight - 40}" stroke="#1e293b" stroke-width="1"/>
  <text x="30" y="${contentHeight - 15}" fill="#64748b" font-family="monospace" font-size="12">Velora's Flash Forge © 2026 • Enterprise System Blueprint • Crisp Vector Architecture Diagram</text>
</svg>`;
}

// 1. SYSTEM CONTEXT DIAGRAM (Deliverable 2)
const svg1 = createSVGWrapper(
  "Deliverable 2: System Context Diagram",
  "External Actors & System Boundaries",
  1200, 650,
  `
  <rect x="50" y="220" width="180" height="180" rx="12" fill="url(#boxBg)" stroke="#38bdf8" stroke-width="2" filter="url(#shadow)"/>
  <text x="140" y="260" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">CUSTOMER</text>
  <text x="140" y="290" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">10,000 Buyers</text>
  <text x="140" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Web / Mobile Client</text>
  <text x="140" y="375" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="11">HTTPS / REST API</text>

  <path d="M 230 310 L 320 310" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="330" y="220" width="180" height="180" rx="12" fill="url(#boxBg)" stroke="#f59e0b" stroke-width="2" filter="url(#shadow)"/>
  <text x="420" y="260" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="15" font-weight="bold">Cloudflare WAF</text>
  <text x="420" y="290" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">DDoS Protection</text>
  <text x="420" y="315" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Token Bucket Limiter</text>
  <text x="420" y="375" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="11">270 Edge Locations</text>

  <path d="M 510 310 L 600 310" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="610" y="160" width="260" height="300" rx="16" fill="#0f172a" stroke="#06b6d4" stroke-width="3" filter="url(#shadow)"/>
  <rect x="630" y="180" width="220" height="40" rx="6" fill="#0284c7"/>
  <text x="740" y="206" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="800">VELORA'S FLASH FORGE</text>
  <text x="740" y="245" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">Core Microservices Platform</text>
  <text x="740" y="275" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">• InventoryEngine.ts</text>
  <text x="740" y="295" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">• SagaOrchestrator.ts</text>
  <text x="740" y="315" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">• reserve_inventory_atomic</text>
  <text x="740" y="335" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">• Redis Lua Pre-Lock</text>
  <text x="740" y="355" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="12">• Kafka Event Streaming</text>

  <rect x="970" y="190" width="180" height="80" rx="10" fill="url(#boxBg)" stroke="#818cf8" stroke-width="2"/>
  <text x="1060" y="225" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="14" font-weight="bold">Stripe Payment API</text>
  <path d="M 870 230 L 960 230" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="970" y="295" width="180" height="80" rx="10" fill="url(#boxBg)" stroke="#a78bfa" stroke-width="2"/>
  <text x="1060" y="330" text-anchor="middle" fill="#a78bfa" font-family="sans-serif" font-size="14" font-weight="bold">FedEx Logistics API</text>
  <path d="M 870 335 L 960 335" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="970" y="400" width="180" height="80" rx="10" fill="url(#boxBg)" stroke="#f472b6" stroke-width="2"/>
  <text x="1060" y="435" text-anchor="middle" fill="#f472b6" font-family="sans-serif" font-size="14" font-weight="bold">Twilio Notification API</text>
  <path d="M 870 440 L 960 440" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  `
);

// 2. HLD ARCHITECTURE DIAGRAM (Deliverable 3)
const svg2 = createSVGWrapper(
  "Deliverable 3: High-Level Architecture (HLD)",
  "End-to-End Pipeline & Component Topology",
  1300, 700,
  `
  <rect x="40" y="160" width="160" height="120" rx="10" fill="url(#boxBg)" stroke="#38bdf8" stroke-width="2"/>
  <text x="120" y="195" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Users / Clients</text>
  <text x="120" y="225" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">10,000 Concurrent</text>
  <path d="M 200 220 L 260 220" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="270" y="160" width="160" height="120" rx="10" fill="url(#boxBg)" stroke="#f59e0b" stroke-width="2"/>
  <text x="350" y="195" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="14" font-weight="bold">Cloudflare WAF</text>
  <text x="350" y="225" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Rate Limit: 5 req/m</text>
  <path d="M 430 220 L 490 220" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="500" y="160" width="160" height="120" rx="10" fill="url(#boxBg)" stroke="#06b6d4" stroke-width="2"/>
  <text x="580" y="195" text-anchor="middle" fill="#06b6d4" font-family="sans-serif" font-size="14" font-weight="bold">Kong API Gateway</text>
  <text x="580" y="225" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Idempotency Filter</text>

  <!-- Core Services -->
  <rect x="40" y="340" width="1220" height="180" rx="14" fill="#0f172a" stroke="#334155" stroke-width="2"/>
  <text x="60" y="365" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">VELORA'S FLASH FORGE MICROSERVICES TIER</text>

  <rect x="70" y="390" width="220" height="110" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="180" y="420" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold">Inventory Service</text>
  <text x="180" y="445" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">InventoryEngine.ts</text>

  <rect x="370" y="390" width="220" height="110" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="480" y="420" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Checkout Orchestrator</text>
  <text x="480" y="445" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">SagaOrchestrator.ts</text>

  <rect x="670" y="390" width="220" height="110" rx="8" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
  <text x="780" y="420" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="14" font-weight="bold">Payment Service</text>
  <text x="780" y="445" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">StripePaymentStrategy</text>

  <rect x="970" y="390" width="220" height="110" rx="8" fill="#1e293b" stroke="#f472b6" stroke-width="2"/>
  <text x="1080" y="420" text-anchor="middle" fill="#f472b6" font-family="sans-serif" font-size="14" font-weight="bold">Order Service</text>
  <text x="1080" y="445" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">OrderStateMachine.ts</text>

  <!-- Storage -->
  <rect x="70" y="550" width="340" height="90" rx="10" fill="url(#boxBg)" stroke="#f59e0b" stroke-width="2"/>
  <text x="240" y="585" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="14" font-weight="bold">Redis Cluster (RAM Guard)</text>
  <text x="240" y="610" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Atomic Lua Pre-Lock Script (&lt;1ms)</text>

  <rect x="480" y="550" width="340" height="90" rx="10" fill="url(#boxBg)" stroke="#34d399" stroke-width="2"/>
  <text x="650" y="585" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold">Supabase PostgreSQL DB</text>
  <text x="650" y="610" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">reserve_inventory_atomic (PL/pgSQL)</text>

  <rect x="890" y="550" width="340" height="90" rx="10" fill="url(#boxBg)" stroke="#a78bfa" stroke-width="2"/>
  <text x="1060" y="585" text-anchor="middle" fill="#a78bfa" font-family="sans-serif" font-size="14" font-weight="bold">Apache Kafka Event Bus</text>
  <text x="1060" y="610" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Async Buffering for 30s Outages</text>
  `
);

// 3. CONTAINER DIAGRAM (Deliverable 4)
const svg3 = createSVGWrapper(
  "Deliverable 4: Container Diagram (C4 Level 2)",
  "Standalone Application Containers & Tech Stack",
  1200, 650,
  `
  <rect x="50" y="160" width="220" height="120" rx="10" fill="url(#boxBg)" stroke="#38bdf8" stroke-width="2"/>
  <text x="160" y="195" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Next.js 14 Frontend Container</text>
  <text x="160" y="225" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">App Router + Tailwind CSS</text>
  <text x="160" y="245" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">frontend/src/app/page.tsx</text>

  <path d="M 270 220 L 370 220" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>

  <rect x="380" y="160" width="220" height="120" rx="10" fill="url(#boxBg)" stroke="#06b6d4" stroke-width="2"/>
  <text x="490" y="195" text-anchor="middle" fill="#06b6d4" font-family="sans-serif" font-size="14" font-weight="bold">API Gateway Container</text>
  <text x="490" y="225" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">Kong Gateway / Node API</text>
  <text x="490" y="245" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">src/app/api/reserve/route.ts</text>

  <!-- Microservice Containers -->
  <rect x="50" y="340" width="260" height="140" rx="10" fill="#0f172a" stroke="#34d399" stroke-width="2"/>
  <text x="180" y="375" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold">Inventory Service Container</text>
  <text x="180" y="405" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">InventoryEngine.ts</text>
  <text x="180" y="430" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">Stock Lock &amp; Expiry Logic</text>

  <rect x="350" y="340" width="260" height="140" rx="10" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
  <text x="480" y="375" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="14" font-weight="bold">Payment Service Container</text>
  <text x="480" y="405" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">PaymentStrategyFactory.ts</text>
  <text x="480" y="430" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">CircuitBreaker.ts (3 threshold)</text>

  <rect x="650" y="340" width="260" height="140" rx="10" fill="#0f172a" stroke="#f472b6" stroke-width="2"/>
  <text x="780" y="375" text-anchor="middle" fill="#f472b6" font-family="sans-serif" font-size="14" font-weight="bold">Order Service Container</text>
  <text x="780" y="405" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">OrderStateMachine.ts</text>
  <text x="780" y="430" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="10">CREATED -&gt; CONFIRMED</text>

  <!-- DB Containers -->
  <rect x="950" y="160" width="200" height="320" rx="12" fill="url(#boxBg)" stroke="#34d399" stroke-width="2"/>
  <text x="1050" y="200" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="15" font-weight="bold">Supabase PostgreSQL</text>
  <text x="1050" y="230" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="11">dqzqbpl...supabase.co</text>
  <text x="1050" y="270" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="10">reserve_inventory_atomic</text>
  <text x="1050" y="300" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="10">release_expired_reservations</text>
  <text x="1050" y="340" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">Tables: inventory, orders,</text>
  <text x="1050" y="360" text-anchor="middle" fill="#94a3b8" font-family="sans-serif" font-size="11">payments, reservations</text>
  `
);

// 4. COMPONENT DIAGRAM (Deliverable 5)
const svg4 = createSVGWrapper(
  "Deliverable 5: Component Diagram (C4 Level 3)",
  "Internal Module Classes & Interfaces in Codebase",
  1200, 650,
  `
  <rect x="50" y="150" width="520" height="420" rx="14" fill="#0f172a" stroke="#34d399" stroke-width="2"/>
  <text x="70" y="180" fill="#34d399" font-family="sans-serif" font-size="15" font-weight="bold">INVENTORY MICROSERVICE COMPONENTS</text>

  <rect x="80" y="210" width="460" height="70" rx="8" fill="#1e293b" stroke="#475569"/>
  <text x="100" y="240" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">API Controller: /api/reserve</text>
  <text x="100" y="260" fill="#cbd5e1" font-family="monospace" font-size="11">POST (productId, customerId, idempotencyKey)</text>

  <rect x="80" y="300" width="460" height="80" rx="8" fill="#1e293b" stroke="#34d399"/>
  <text x="100" y="330" fill="#34d399" font-family="monospace" font-size="13" font-weight="bold">InventoryEngine.ts (Singleton)</text>
  <text x="100" y="350" fill="#cbd5e1" font-family="monospace" font-size="11">reserveStock() / releaseReservation() / confirmReservation()</text>

  <rect x="80" y="400" width="460" height="140" rx="8" fill="#1e293b" stroke="#f59e0b"/>
  <text x="100" y="430" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="bold">Supabase RPC: reserve_inventory_atomic</text>
  <text x="100" y="455" fill="#cbd5e1" font-family="monospace" font-size="10">SELECT ... FOR UPDATE (Row Locking)</text>
  <text x="100" y="475" fill="#cbd5e1" font-family="monospace" font-size="10">UPDATE inventory SET available_quantity = available - 1</text>
  <text x="100" y="495" fill="#cbd5e1" font-family="monospace" font-size="10">INSERT INTO inventory_reservations (expires_at NOW() + 15m)</text>

  <rect x="630" y="150" width="520" height="420" rx="14" fill="#0f172a" stroke="#818cf8" stroke-width="2"/>
  <text x="650" y="180" fill="#818cf8" font-family="sans-serif" font-size="15" font-weight="bold">PAYMENT &amp; SAGA COMPONENTS</text>

  <rect x="660" y="210" width="460" height="70" rx="8" fill="#1e293b" stroke="#475569"/>
  <text x="680" y="240" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">SagaOrchestrator.ts</text>
  <text x="680" y="260" fill="#cbd5e1" font-family="monospace" font-size="11">executeCheckoutSaga() -&gt; Triggers Compensation on Fail</text>

  <rect x="660" y="300" width="460" height="80" rx="8" fill="#1e293b" stroke="#818cf8"/>
  <text x="680" y="330" fill="#818cf8" font-family="monospace" font-size="13" font-weight="bold">CircuitBreaker.ts (Pattern)</text>
  <text x="680" y="350" fill="#cbd5e1" font-family="monospace" font-size="11">State: CLOSED | OPEN | HALF_OPEN (3 Failure Threshold)</text>

  <rect x="660" y="400" width="460" height="140" rx="8" fill="#1e293b" stroke="#a78bfa"/>
  <text x="680" y="430" fill="#a78bfa" font-family="monospace" font-size="13" font-weight="bold">PaymentStrategyFactory.ts (Pattern)</text>
  <text x="680" y="455" fill="#cbd5e1" font-family="monospace" font-size="11">• StripePaymentStrategy (processPayment)</text>
  <text x="680" y="475" fill="#cbd5e1" font-family="monospace" font-size="11">• PayPalPaymentStrategy (processPayment)</text>
  <text x="680" y="495" fill="#34d399" font-family="monospace" font-size="11">OrderStateMachine.ts (CREATED -&gt; CONFIRMED)</text>
  `
);

// 5. DEPLOYMENT DIAGRAM (Deliverable 6)
const svg5 = createSVGWrapper(
  "Deliverable 6: Deployment Diagram",
  "AWS Kubernetes EKS Multi-AZ Production Infrastructure",
  1200, 650,
  `
  <rect x="40" y="150" width="1120" height="440" rx="14" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
  <text x="60" y="180" fill="#38bdf8" font-family="sans-serif" font-size="15" font-weight="bold">AWS REGION (us-east-1) — KUBERNETES EKS CLUSTER</text>

  <!-- AZ A -->
  <rect x="70" y="210" width="510" height="350" rx="10" fill="#1e293b" stroke="#334155" stroke-dasharray="5 5"/>
  <text x="90" y="235" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">AVAILABILITY ZONE A (AZ-A)</text>
  <rect x="90" y="260" width="470" height="80" rx="6" fill="#0f172a" stroke="#38bdf8"/>
  <text x="110" y="295" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">Ingress Controller Pod (AWS ALB)</text>
  
  <rect x="90" y="360" width="220" height="80" rx="6" fill="#0f172a" stroke="#34d399"/>
  <text x="200" y="395" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">Inventory Pod A</text>
  
  <rect x="340" y="360" width="220" height="80" rx="6" fill="#0f172a" stroke="#818cf8"/>
  <text x="450" y="395" text-anchor="middle" fill="#818cf8" font-family="monospace" font-size="12" font-weight="bold">Payment Pod A</text>

  <rect x="90" y="460" width="470" height="80" rx="6" fill="#0f172a" stroke="#f59e0b"/>
  <text x="325" y="495" text-anchor="middle" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="bold">Redis Primary Node (Master)</text>

  <!-- AZ B -->
  <rect x="620" y="210" width="510" height="350" rx="10" fill="#1e293b" stroke="#334155" stroke-dasharray="5 5"/>
  <text x="640" y="235" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold">AVAILABILITY ZONE B (AZ-B)</text>
  <rect x="640" y="260" width="470" height="80" rx="6" fill="#0f172a" stroke="#38bdf8"/>
  <text x="660" y="295" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">Ingress Controller Pod (AWS ALB)</text>

  <rect x="640" y="360" width="220" height="80" rx="6" fill="#0f172a" stroke="#34d399"/>
  <text x="750" y="395" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">Inventory Pod B</text>

  <rect x="890" y="360" width="220" height="80" rx="6" fill="#0f172a" stroke="#818cf8"/>
  <text x="1000" y="395" text-anchor="middle" fill="#818cf8" font-family="monospace" font-size="12" font-weight="bold">Payment Pod B</text>

  <rect x="640" y="460" width="470" height="80" rx="6" fill="#0f172a" stroke="#34d399"/>
  <text x="875" y="495" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">Supabase PostgreSQL Primary (Write/Read)</text>
  `
);

// 6. ER DIAGRAM (Deliverable 7)
const svg6 = createSVGWrapper(
  "Deliverable 7: Database ER Diagram",
  "Supabase PostgreSQL Entities, Keys & Constraints",
  1200, 650,
  `
  <rect x="40" y="160" width="240" height="180" rx="8" fill="url(#boxBg)" stroke="#38bdf8" stroke-width="2"/>
  <rect x="40" y="160" width="240" height="35" rx="8" fill="#0284c7"/>
  <text x="160" y="183" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">CUSTOMERS</text>
  <text x="55" y="220" fill="#34d399" font-family="monospace" font-size="11">PK customer_id (UUID)</text>
  <text x="55" y="245" fill="#cbd5e1" font-family="monospace" font-size="11">full_name VARCHAR(150)</text>
  <text x="55" y="270" fill="#f59e0b" font-family="monospace" font-size="11">UK email VARCHAR(255)</text>
  <text x="55" y="295" fill="#cbd5e1" font-family="monospace" font-size="11">phone VARCHAR(50)</text>

  <rect x="330" y="160" width="260" height="210" rx="8" fill="url(#boxBg)" stroke="#34d399" stroke-width="2"/>
  <rect x="330" y="160" width="260" height="35" rx="8" fill="#059669"/>
  <text x="460" y="183" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">INVENTORY (Critical)</text>
  <text x="345" y="220" fill="#34d399" font-family="monospace" font-size="11">PK inventory_id (UUID)</text>
  <text x="345" y="245" fill="#38bdf8" font-family="monospace" font-size="11">FK product_id (UUID, UK)</text>
  <text x="345" y="270" fill="#fbbf24" font-family="monospace" font-size="11">available_quantity INT &gt;= 0</text>
  <text x="345" y="295" fill="#cbd5e1" font-family="monospace" font-size="11">reserved_quantity INT &gt;= 0</text>
  <text x="345" y="320" fill="#cbd5e1" font-family="monospace" font-size="11">sold_quantity INT &gt;= 0</text>
  <text x="345" y="345" fill="#a78bfa" font-family="monospace" font-size="11">version BIGINT (OCC)</text>

  <rect x="640" y="160" width="260" height="210" rx="8" fill="url(#boxBg)" stroke="#f59e0b" stroke-width="2"/>
  <rect x="640" y="160" width="260" height="35" rx="8" fill="#d97706"/>
  <text x="770" y="183" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">RESERVATIONS (Critical)</text>
  <text x="655" y="220" fill="#34d399" font-family="monospace" font-size="11">PK reservation_id (UUID)</text>
  <text x="655" y="245" fill="#38bdf8" font-family="monospace" font-size="11">FK customer_id, product_id</text>
  <text x="655" y="270" fill="#cbd5e1" font-family="monospace" font-size="11">status (RESERVED|RELEASED)</text>
  <text x="655" y="295" fill="#fbbf24" font-family="monospace" font-size="11">expires_at TIMESTAMPTZ</text>
  <text x="655" y="320" fill="#f59e0b" font-family="monospace" font-size="11">UK idempotency_key</text>

  <rect x="940" y="160" width="220" height="210" rx="8" fill="url(#boxBg)" stroke="#818cf8" stroke-width="2"/>
  <rect x="940" y="160" width="220" height="35" rx="8" fill="#4f46e5"/>
  <text x="1050" y="183" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">PAYMENTS</text>
  <text x="955" y="220" fill="#34d399" font-family="monospace" font-size="11">PK payment_id (UUID)</text>
  <text x="955" y="245" fill="#38bdf8" font-family="monospace" font-size="11">FK reservation_id (UUID)</text>
  <text x="955" y="270" fill="#cbd5e1" font-family="monospace" font-size="11">amount DECIMAL(10,2)</text>
  <text x="955" y="295" fill="#cbd5e1" font-family="monospace" font-size="11">status (SUCCESS|FAILED)</text>
  <text x="955" y="320" fill="#f59e0b" font-family="monospace" font-size="11">UK idempotency_key</text>

  <rect x="330" y="410" width="260" height="170" rx="8" fill="url(#boxBg)" stroke="#f472b6" stroke-width="2"/>
  <rect x="330" y="410" width="260" height="35" rx="8" fill="#db2777"/>
  <text x="460" y="433" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="13" font-weight="bold">ORDERS</text>
  <text x="345" y="470" fill="#34d399" font-family="monospace" font-size="11">PK order_id (UUID)</text>
  <text x="345" y="495" fill="#38bdf8" font-family="monospace" font-size="11">FK reservation_id (UK)</text>
  <text x="345" y="520" fill="#cbd5e1" font-family="monospace" font-size="11">status (CONFIRMED)</text>
  <text x="345" y="545" fill="#f59e0b" font-family="monospace" font-size="11">UK idempotency_key</text>
  `
);

// 7. CLASS DIAGRAM (Deliverable 8)
const svg7 = createSVGWrapper(
  "Deliverable 8: UML Class Diagram",
  "Domain Model Classes, Pattern Interfaces & Relationships",
  1200, 650,
  `
  <rect x="50" y="160" width="260" height="200" rx="8" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="180" y="190" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">InventoryEngine</text>
  <line x1="50" y1="200" x2="310" y2="200" stroke="#34d399"/>
  <text x="65" y="225" fill="#cbd5e1" font-family="monospace" font-size="11">- availableQuantity: number</text>
  <text x="65" y="245" fill="#cbd5e1" font-family="monospace" font-size="11">- reservedQuantity: number</text>
  <text x="65" y="265" fill="#cbd5e1" font-family="monospace" font-size="11">- idempotencyStore: Map</text>
  <line x1="50" y1="280" x2="310" y2="280" stroke="#34d399"/>
  <text x="65" y="305" fill="#38bdf8" font-family="monospace" font-size="11">+ reserveStock(): Promise</text>
  <text x="65" y="325" fill="#38bdf8" font-family="monospace" font-size="11">+ releaseReservation(): bool</text>
  <text x="65" y="345" fill="#38bdf8" font-family="monospace" font-size="11">+ confirmReservation(): bool</text>

  <rect x="360" y="160" width="260" height="200" rx="8" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
  <text x="490" y="190" text-anchor="middle" fill="#818cf8" font-family="monospace" font-size="14" font-weight="bold">SagaOrchestrator</text>
  <line x1="360" y1="200" x2="620" y2="200" stroke="#818cf8"/>
  <text x="375" y="225" fill="#cbd5e1" font-family="monospace" font-size="11">- inventoryEngine: Engine</text>
  <text x="375" y="245" fill="#cbd5e1" font-family="monospace" font-size="11">- circuitBreaker: Breaker</text>
  <text x="375" y="265" fill="#cbd5e1" font-family="monospace" font-size="11">- orders: Map&lt;string, Order&gt;</text>
  <line x1="360" y1="280" x2="620" y2="280" stroke="#818cf8"/>
  <text x="375" y="315" fill="#38bdf8" font-family="monospace" font-size="11">+ executeCheckoutSaga()</text>

  <rect x="670" y="160" width="260" height="150" rx="8" fill="#1e293b" stroke="#a78bfa" stroke-width="2"/>
  <text x="800" y="190" text-anchor="middle" fill="#a78bfa" font-family="monospace" font-size="14" font-weight="bold">&lt;&lt;interface&gt;&gt; IPaymentStrategy</text>
  <line x1="670" y1="200" x2="930" y2="200" stroke="#a78bfa"/>
  <text x="685" y="240" fill="#38bdf8" font-family="monospace" font-size="11">+ processPayment(req): Promise</text>

  <rect x="670" y="350" width="260" height="100" rx="8" fill="#1e293b" stroke="#a78bfa"/>
  <text x="800" y="380" text-anchor="middle" fill="#a78bfa" font-family="monospace" font-size="13" font-weight="bold">StripePaymentStrategy</text>
  <text x="685" y="415" fill="#38bdf8" font-family="monospace" font-size="11">+ processPayment(): PaymentResponse</text>
  `
);

// 8. PURCHASE SEQUENCE DIAGRAM (Deliverable 9)
const svg8 = createSVGWrapper(
  "Deliverable 9: Purchase / Reservation Sequence",
  "Sequence of Atomic Reservation & Idempotency Check",
  1200, 650,
  `
  <!-- Lifelines -->
  <text x="100" y="180" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Customer</text>
  <line x1="100" y1="195" x2="100" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="350" y="180" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="14" font-weight="bold">API Gateway</text>
  <line x1="350" y1="195" x2="350" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="600" y="180" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="14" font-weight="bold">InventoryEngine</text>
  <line x1="600" y1="195" x2="600" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="950" y="180" text-anchor="middle" fill="#06b6d4" font-family="sans-serif" font-size="14" font-weight="bold">Supabase PostgreSQL RPC</text>
  <line x1="950" y1="195" x2="950" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <!-- Messages -->
  <path d="M 100 240 L 350 240" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="225" y="230" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">POST /api/reserve (X-Idempotency-Key)</text>

  <path d="M 350 290 L 600 290" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="475" y="280" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">reserveStock(productId, customerId, key)</text>

  <path d="M 600 340 L 950 340" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="775" y="330" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">reserve_inventory_atomic (FOR UPDATE)</text>

  <path d="M 950 410 L 600 410" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrowGreen)"/>
  <text x="775" y="400" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">JSON { success: true, reservation_id }</text>

  <path d="M 600 470 L 100 470" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrowGreen)"/>
  <text x="350" y="460" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">201 Created (reservationId, status: RESERVED)</text>
  `
);

// 9. PAYMENT SEQUENCE DIAGRAM (Deliverable 10)
const svg9 = createSVGWrapper(
  "Deliverable 10: Payment Sequence Diagram",
  "Circuit Breaker Guard & Strategy Pattern Execution",
  1200, 650,
  `
  <text x="100" y="180" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-size="14" font-weight="bold">Customer</text>
  <line x1="100" y1="195" x2="100" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="400" y="180" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="14" font-weight="bold">SagaOrchestrator</text>
  <line x1="400" y1="195" x2="400" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="700" y="180" text-anchor="middle" fill="#f59e0b" font-family="sans-serif" font-size="14" font-weight="bold">CircuitBreaker</text>
  <line x1="700" y1="195" x2="700" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="1000" y="180" text-anchor="middle" fill="#a78bfa" font-family="sans-serif" font-size="14" font-weight="bold">StripePaymentStrategy</text>
  <line x1="1000" y1="195" x2="1000" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <path d="M 100 240 L 400 240" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="250" y="230" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">POST /api/checkout (reservationId)</text>

  <path d="M 400 300 L 700 300" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="550" y="290" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">execute(processPayment)</text>

  <path d="M 700 360 L 1000 360" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="850" y="350" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">processPayment(request)</text>

  <path d="M 1000 420 L 400 420" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrowGreen)"/>
  <text x="700" y="410" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">{ success: true, txnRef: 'str_txn_123' }</text>

  <path d="M 400 480 L 100 480" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrowGreen)"/>
  <text x="250" y="470" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">200 OK (Payment Verified, Order Confirmed)</text>
  `
);

// 10. ORDER SEQUENCE DIAGRAM (Deliverable 11)
const svg10 = createSVGWrapper(
  "Deliverable 11: Order Sequence & Saga Compensation",
  "Async Kafka Event Stream & 30s Downstream Outage Recovery",
  1200, 650,
  `
  <text x="100" y="180" text-anchor="middle" fill="#818cf8" font-family="sans-serif" font-size="14" font-weight="bold">Payment Service</text>
  <line x1="100" y1="195" x2="100" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="450" y="180" text-anchor="middle" fill="#a78bfa" font-family="sans-serif" font-size="14" font-weight="bold">Kafka Topic (payment.succeeded)</text>
  <line x1="450" y1="195" x2="450" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <text x="850" y="180" text-anchor="middle" fill="#f472b6" font-family="sans-serif" font-size="14" font-weight="bold">Order Service (30s Outage)</text>
  <line x1="850" y1="195" x2="850" y2="580" stroke="#334155" stroke-dasharray="4 4"/>

  <path d="M 100 240 L 450 240" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="275" y="230" text-anchor="middle" fill="#cbd5e1" font-family="monospace" font-size="11">Publish Event: payment.succeeded</text>

  <rect x="700" y="270" width="300" height="80" rx="8" fill="#ef4444" opacity="0.2" stroke="#ef4444"/>
  <text x="850" y="315" text-anchor="middle" fill="#fca5a5" font-family="monospace" font-size="12" font-weight="bold">Order Service Offline (30s Crash)</text>

  <path d="M 450 420 L 850 420" stroke="#34d399" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <text x="650" y="410" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="11">Order Service Recovers -&gt; Poll Kafka Event</text>

  <rect x="730" y="460" width="240" height="60" rx="6" fill="#1e293b" stroke="#34d399"/>
  <text x="850" y="495" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="12" font-weight="bold">Order State: CONFIRMED</text>
  `
);

// 11. STATE DIAGRAM (Deliverable 12)
const svg11 = createSVGWrapper(
  "Deliverable 12: Order & Reservation State Diagram",
  "SOLID State Machine Transition Guards & Compensation Rules",
  1200, 650,
  `
  <!-- Available -->
  <rect x="50" y="280" width="160" height="70" rx="35" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="130" y="320" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-size="14" font-weight="bold">AVAILABLE</text>

  <path d="M 210 315 L 310 315" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="260" y="305" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="10">reserveStock()</text>

  <!-- Reserved -->
  <rect x="320" y="280" width="160" height="70" rx="10" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
  <text x="400" y="320" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="14" font-weight="bold">RESERVED</text>

  <path d="M 480 315 L 580 315" stroke="#38bdf8" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="530" y="305" text-anchor="middle" fill="#cbd5e1" font-family="sans-serif" font-size="10">Payment Pending</text>

  <!-- Payment Pending -->
  <rect x="590" y="280" width="180" height="70" rx="10" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
  <text x="680" y="320" text-anchor="middle" fill="#818cf8" font-family="monospace" font-size="14" font-weight="bold">PAYMENT_PENDING</text>

  <path d="M 770 315 L 870 315" stroke="#34d399" stroke-width="2" marker-end="url(#arrowGreen)"/>
  <text x="820" y="305" text-anchor="middle" fill="#34d399" font-family="sans-serif" font-size="10">Pay Success</text>

  <!-- Confirmed -->
  <rect x="880" y="280" width="160" height="70" rx="10" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
  <text x="960" y="320" text-anchor="middle" fill="#34d399" font-family="monospace" font-size="14" font-weight="bold">CONFIRMED</text>

  <!-- Failure Path -->
  <path d="M 400 350 L 400 480 L 130 480 L 130 350" stroke="#f87171" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrow)"/>
  <text x="265" y="470" text-anchor="middle" fill="#f87171" font-family="sans-serif" font-size="11">Compensation Release: Stock Returned to Pool (Payment Fail / Expiry)</text>
  `
);

const svgMap = {
  '01_system_context_diagram.svg': svg1,
  '02_hld_architecture.svg': svg2,
  '03_container_diagram.svg': svg3,
  '04_component_diagram.svg': svg4,
  '05_deployment_diagram.svg': svg5,
  '06_er_diagram.svg': svg6,
  '07_class_diagram.svg': svg7,
  '08_purchase_sequence_diagram.svg': svg8,
  '09_payment_sequence_diagram.svg': svg9,
  '10_order_sequence_diagram.svg': svg10,
  '11_state_diagram.svg': svg11
};

Object.entries(svgMap).forEach(([filename, svgContent]) => {
  fs.writeFileSync(path.join(diagramsDir, filename), svgContent);
  fs.writeFileSync(path.join(frontendPublicDir, filename), svgContent);
});

console.log("All 11 Vector SVG diagrams generated cleanly with Velora's Flash Forge branding!");
