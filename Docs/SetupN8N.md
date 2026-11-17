# Self-Hosted n8n + Evolution API (v2) + Manager Stack

### (with PostgreSQL, Redis & Caddy SSL)

This guide documents deploying a production WhatsApp automation platform using:

* **n8n** for workflow automation
* **Evolution API (v2)** for WhatsApp message management
* **Evolution Manager** for visual instance management
* **PostgreSQL** for structured data persistence with dedicated non-root application roles
* **Redis** for isolated caching and task queueing
* **Caddy** as a secure HTTPS reverse proxy with automatic TLS certificates

All services are containerized using **Docker Compose**, segregated across internal networks, and configured with pinned image tags and least-privilege credentials.

-----

## System Architecture

```mermaid
graph TD
    User((Public Internet)) -->|HTTPS :443| Caddy[Caddy Reverse Proxy]
    
    subgraph "DMZ / Ingress Network (frontend_net)"
        Caddy -->|/| n8n[n8n Automation :5678]
        Caddy -->|/evolutionapi| EvoAPI[Evolution API :8080]
        Caddy -->|/manager| EvoMan[Evolution Manager :3000]
    end
    
    subgraph "Internal Data Network (backend_net)"
        EvoAPI --> Postgres[(PostgreSQL :5432)]
        EvoAPI --> Redis[(Redis Cache :6379)]
        n8n --> EvoAPI
    end
```

-----

## Project Structure

```
n8n/
├── data/
│   ├── postgres/
│   └── redis/
├── init-db/
│   └── 01-init-user-db.sql
├── docker-compose.yml
├── .env.n8n
├── .env.evolution
├── .env.postgres
└── /etc/caddy/Caddyfile
```

-----

## Database Initialization (`init-db/01-init-user-db.sql`)

To follow the principle of least privilege, avoid connecting applications as the PostgreSQL superuser (`postgres`). Create a dedicated runtime application role with restricted grants on the target database:

```sql
-- Executed on initial database container bootstrap
CREATE USER evolution_user WITH PASSWORD 'your-runtime-db-password';
CREATE DATABASE evolution OWNER evolution_user;
GRANT ALL PRIVILEGES ON DATABASE evolution TO evolution_user;
\connect evolution
GRANT ALL ON SCHEMA public TO evolution_user;
```

-----

## Scoped Environment Configurations

Separate configuration files by service role so secrets are not shared across unrelated containers.

### 1. PostgreSQL Environment (`.env.postgres`)
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-root-admin-password
POSTGRES_DB=evolution
```

### 2. Evolution API Environment (`.env.evolution`)
```bash
SERVER_URI=https://yourdomain.com/evolutionapi
AUTHENTICATION_API_KEY=your-secure-server-api-key
PORT=8080
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
# Connect using dedicated non-superuser role
DATABASE_CONNECTION_URI=postgresql://evolution_user:your-runtime-db-password@postgres:5432/evolution

CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379/0
CACHE_REDIS_PREFIX_KEY=evolution_v2
CACHE_LOCAL_ENABLED=false
```

> **Security Note regarding API Keys and Browser Clients:**
> Never expose `AUTHENTICATION_API_KEY` to client-side bundles via `VITE_` variables. The Evolution Manager should communicate with the API via reverse-proxy or authenticated session tokens without distributing persistent master server keys to visitor browsers.

### 3. n8n Environment (`.env.n8n`)
```bash
N8N_HOST=yourdomain.com
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://yourdomain.com
NODE_ENV=production
GENERIC_TIMEZONE=Asia/Kolkata
EXECUTIONS_CONCURRENCY=1
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168
EXECUTIONS_DATA_PRUNE_MAX_COUNT=5000
DB_SQLITE_VACUUM_ON_STARTUP=true
```

-----

## Docker Compose Configuration (`docker-compose.yml`)

Services are pinned to specific version tags to ensure reproducible deployments and reliable rollback capabilities.

```yaml
version: '3.8'

networks:
  frontend_net:
    driver: bridge
  backend_net:
    internal: true

volumes:
  n8n_data:
  evolution_instances:

services:
  # n8n Automation Platform
  n8n:
    image: docker.io/n8nio/n8n:1.76.0
    container_name: n8n
    restart: always
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - TZ=Asia/Kolkata
    env_file:
      - .env.n8n
    networks:
      - frontend_net
      - backend_net
    volumes:
      - n8n_data:/home/node/.n8n

  # Evolution API
  evolution-api:
    image: evoapicloud/evolution-api:v2.1.2
    container_name: evolution_api
    restart: always
    depends_on:
      - redis
      - postgres
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      - TZ=Asia/Kolkata
    env_file:
      - .env.evolution
    networks:
      - frontend_net
      - backend_net
    volumes:
      - evolution_instances:/evolution/instances

  # PostgreSQL Database (Restricted to internal backend network)
  postgres:
    image: postgres:15.10-alpine
    container_name: postgres
    restart: always
    environment:
      - TZ=Asia/Kolkata
    env_file:
      - .env.postgres
    networks:
      - backend_net
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d:ro

  # Redis Cache (Restricted to internal backend network)
  redis:
    image: redis:7.4.2-alpine
    container_name: redis
    restart: always
    command: ["redis-server", "--appendonly", "yes", "--requirepass", "your-redis-auth-token"]
    environment:
      - TZ=Asia/Kolkata
    networks:
      - backend_net
    volumes:
      - ./data/redis:/data

  # Evolution Manager Dashboard
  evolution_manager:
    image: evoapicloud/evolution-manager:v2.1.2
    container_name: evolution_manager
    restart: always
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - evolution-api
    entrypoint: /bin/sh
    command: >
      -c "sed -i 's/ must-revalidate//g' /etc/nginx/conf.d/nginx.conf && nginx -g 'daemon off;'"
    environment:
      - TZ=Asia/Kolkata
      - SERVER_URL=https://yourdomain.com/evolutionapi
    networks:
      - frontend_net
```

-----

## Caddy Reverse Proxy Configuration (`/etc/caddy/Caddyfile`)

```caddyfile
yourdomain.com {
    encode gzip

    # Evolution API
    handle_path /evolutionapi/* {
        reverse_proxy localhost:8080 {
            header_up X-Real-IP {remote_host}
        }
    }

    # Evolution Manager
    handle_path /manager/* {
        reverse_proxy localhost:3000 {
            header_up X-Real-IP {remote_host}
        }
    }

    # n8n Automation Engine
    handle {
        reverse_proxy localhost:5678 {
            flush_interval -1
            header_up X-Real-IP {remote_host}
        }
    }

    # Security Headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
}
```

-----

## Version Pinning & Reproducible Rollbacks

To lock images to verifiable cryptographic digests rather than mutable tags:

1. Inspect the image SHA-256 digest after pulling:
   ```bash
   docker image inspect --format='{{index .RepoDigests 0}}' evoapicloud/evolution-api:v2.1.2
   ```
2. Reference the digest directly in `docker-compose.yml`:
   ```yaml
   image: evoapicloud/evolution-api@sha256:d83f0f9b66236b...
   ```
3. To rollback, revert the image tag or digest in `docker-compose.yml` and recreate containers:
   ```bash
   docker compose up -d --force-recreate
   ```
