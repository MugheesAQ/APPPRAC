# 🏛️ Unified Citizen Portal (GovPortal Gateway)

A containerized, production-grade public service portal featuring premium government-style designs, real-time dynamic counters, in-memory caching systems, and security-cleared profiles. Styled with a custom **Cosmic Slate Theme** utilizing **Inter** and **JetBrains Mono** typography.

---

## 🚀 Quick Start Guide (Linux Deployment)

Prerequisites: Ensure **Docker Core** and **Docker Compose** (V2+) are active on your Linux node.

### 1. Run the Platform
Navigate to the projects root containing `docker-compose.yml` and trigger Docker Compose:
```bash
make up
```
*This command compiles multi-stage React builds into Nginx static directories, boots the Node/Prisma REST server, maps persistent Postgres directories, and registers Redis persistence.*

### 2. Form Scheme Database Migrations
Once active, migrate the Prisma specifications to the PostgreSQL engine:
```bash
make db-migrate
```

### 3. Seed Catalogue Services
Seed default users and the department services catalog (Immigration, Revenue, and Transport lists):
```bash
make db-seed
```

---

## 🔒 Accessing credentials

Default port mappings are configured behind Nginx reverse proxy routing:
*   **Web Portal Entrance:** [http://localhost](http://localhost) (mapped via Port 80)
*   **Central REST API Gateway Node:** [http://localhost/api](http://localhost/api) (routed internally to Port 5000)

### Mock Login Profiles
Use these Singpass credentials to test citizen vs officer view capabilities:

1.  **Verified Citizen Profile (Singpass):**
    *   **Email:** `citizen@gov.sg`
    *   **Password:** `citizen123`
    *   **Clearance:** Accesses personal Dashboard, submits passport renewals, uploads attachments, and tracks timeline steps.

2.  **Senior Audit Officer (Officer Terminal):**
    *   **Email:** `admin@gov.sg`
    *   **Password:** `admin123`
    *   **Clearance:** Core Auditing console, updates status logs, reviews Redis in-memory hits, and audits system trails.

---

## ⚡ Verifying cache hits and logs

1.  **In-Memory Redis Check:**
    Common requests like Service catalogue fetches are cached in Redis for 5 minutes. You can easily view this by inspecting headers or booting the Redis shell terminal:
    ```bash
    docker exec -it citizen_portal_cache redis-cli KEYS "cache:*"
    ```
    *The Web console displays exact caching sources (e.g., 'Simulated Redis Cache Hit' or 'Singular Database queries') matching performance stats.*

2.  **Viewing Audit Trails:**
    Audit trails log security tasks like `LOGIN_SUCCESS`, `SUBMIT_APPLICATION`, or profile shifts. Access the live log output using:
    ```bash
    docker compose logs -f backend
    ```

---

## 🏗️ Technical Architecture Details

*   **Frontend SPA Stack:** React + ESM Vite + Tailwind CSS + Framer Motion + Zustand Stores
*   **Database ORM Layer:** Prisma Client + Postgres Alpine
*   **Reverse Proxy Zone:** Nginx rate-limiting (12 requests/sec) + Gzip + Hardened CSP frame filters.
