

# 🚀 Self-Hosted n8n + Evolution API (v2) + Manager Stack

### (with PostgreSQL, Redis & Caddy SSL)

This setup deploys a **complete WhatsApp automation platform** using:

  * **n8n** for workflow automation
  * **Evolution API (v2)** for WhatsApp message management
  * **Evolution Manager** for a visual dashboard to manage instances
  * **PostgreSQL** for structured data persistence
  * **Redis** for caching and queueing
  * **Caddy** as a secure HTTPS reverse proxy (automatic SSL certificates)

All services are containerized using **Docker Compose** and configured for the **Asia/Kolkata** timezone.

-----

## 🧠 System Architecture Overview

```mermaid
graph TD
    User((Public Internet)) -->|HTTPS :443| Caddy[Caddy Reverse Proxy]
    
    subgraph "Internal Docker Network"
    Caddy -->|/| n8n[n8n Automation :5678]
    Caddy -->|/evolutionapi| EvoAPI[Evolution API :8080]
    Caddy -->|/manager| EvoMan[Evolution Manager :3000]
    
    EvoAPI --> Postgres[(PostgreSQL)]
    EvoAPI --> Redis[(Redis Cache)]
    EvoMan --> EvoAPI
    n8n --> EvoAPI
    end
```

-----

## 📁 Project Structure

```
n8n/
├── data/
│   ├── postgres/
│   └── redis/
├── docker-compose.yml
├── .env
└── /etc/caddy/Caddyfile
```

-----

## ⚙️ Environment Variables (`.env`)

Create a `.env` file with the following configuration.

> ⚠️ **IMPORTANT:** Replace `yourdomain.com` with your actual domain and generate strong passwords/keys.

```bash
# ==========================================================
# 🧠 N8N CONFIGURATION
# ==========================================================
N8N_HOST=yourdomain.com
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://yourdomain.com
VUE_APP_URL=https://yourdomain.com
NODE_ENV=production
GENERIC_TIMEZONE=Asia/Kolkata
EXECUTIONS_CONCURRENCY=1
EXECUTIONS_DATA_PRUNE=true
EXECUTIONS_DATA_MAX_AGE=168
EXECUTIONS_DATA_PRUNE_MAX_COUNT=5000
DB_SQLITE_VACUUM_ON_STARTUP=true

# ==========================================================
# 🗃  POSTGRESQL DATABASE CONFIGURATION
# ==========================================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-postgres-password
POSTGRES_DB=evolution

# ==========================================================
# ⚙️  EVOLUTION API CONFIGURATION
# ==========================================================
# The URI used by the Manager to talk to the API
SERVER_URI=https://yourdomain.com/evolutionapi
AUTHENTICATION_API_KEY=your-secure-api-key
PORT=8080

DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}

CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379/0
CACHE_REDIS_PREFIX_KEY=evolution_v2
CACHE_LOCAL_ENABLED=false
VITE_EVOLUTION_API_URL=${SERVER_URI}
VITE_EVOLUTION_API_KEY=${AUTHENTICATION_API_KEY}
```

-----

## 🐳 Docker Compose Configuration (`docker-compose.yml`)

Updated to include **Timezones** and the **Manager Entrypoint Fix**.

```yaml

volumes:
  n8n_data:
  evolution_instances:

services:
  # 🧠 n8n Automation Platform
  n8n:
    image: docker.io/n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "127.0.0.1:5678:5678"
    environment:
      - TZ=Asia/Kolkata
    env_file:
      - .env
    volumes:
      - n8n_data:/home/node/.n8n

  # ⚙️ Evolution API
  evolution-api:
    image: evoapicloud/evolution-api:latest
    container_name: evolution_api
    restart: always
    depends_on:
      - redis
      - postgres
    ports:
      - "127.0.0.1:8080:8080"
    environment:
      - TZ=Asia/Kolkata
    volumes:
      - evolution_instances:/evolution/instances
    env_file:
      - .env

  # 🗃 PostgreSQL Database
  postgres:
    image: postgres:15
    container_name: postgres
    restart: always
    environment:
      - TZ=Asia/Kolkata
    env_file:
      - .env
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  # ⚡ Redis Cache
  redis:
    image: redis:7
    container_name: redis
    restart: always
    environment:
      - TZ=Asia/Kolkata
    volumes:
      - ./data/redis:/data

  # 🧩 Evolution Manager Dashboard
  evolution_manager:
    image: evoapicloud/evolution-manager:latest
    container_name: evolution_manager
    restart: always
    ports:
      - "127.0.0.1:3000:80"
    depends_on:
      - evolution-api
    # ⚠️ CRITICAL: This fixes the Nginx caching bug in the manager
    entrypoint: /bin/sh
    command: >
      -c "sed -i 's/ must-revalidate//g' /etc/nginx/conf.d/nginx.conf && nginx -g 'daemon off;'"
    env_file:
      - .env
```

-----

## 🌐 Caddy SSL Reverse Proxy (`/etc/caddy/Caddyfile`)

This configuration handles the sub-paths for the API and Manager correctly.

```nginx
yourdomain.com {
    # 1. Performance
    encode gzip



    # 2. Evolution API (Access via /evolutionapi/)
    handle_path /evolutionapi/* {
        reverse_proxy localhost:8080 {
            header_up X-Real-IP {remote_host}
        }
    }

    # 3. n8n (Root Path - Must be last)
    handle {
        reverse_proxy localhost:5678 {
            flush_interval -1
            header_up X-Real-IP {remote_host}
        }
    }

    # 4. Security Headers
    header {
        Strict-Transport-Security "max-age=31536000;"
        X-Content-Type-Options "nosniff"
    }
}
```

-----

## 🚀 Accessing Your Services

| Service | URL | Note |
| :--- | :--- | :--- |
| **n8n** | `https://yourdomain.com` | Main automation tool |
| **Evolution Manager** | `http://localhost:3000/manager/` | **Must include trailing slash `/`** |
| **Evolution API** | `https://yourdomain.com/evolutionapi` | Used by Manager & n8n |

-----

## 🧰 Management Commands

**Update & Restart Stack:**

```bash
docker compose pull
docker compose up -d
```

**Reload Caddy (after config changes):**

```bash
sudo systemctl reload caddy
```

**Clean Logs & Cache (Weekly Maintenance):**

```bash
# Deletes old logs and unused docker images
sudo /etc/cron.weekly/vps-cleaner
```


### 🚀 How to run VM 


```bash
ssh -L 3000:localhost:3000 your-user@your-vps-ip
```
