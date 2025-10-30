

# 🚀 Self-Hosted n8n + Ollama + Evolution API Stack (with PostgreSQL, Redis & Caddy SSL)

This setup deploys a **complete automation and AI workflow platform** using:

* **n8n** for workflow automation
* **Ollama** for local LLM inference
* **Evolution API** for intelligent message management
* **PostgreSQL** for structured data persistence
* **Redis** for caching and queueing
* **Caddy** as a secure HTTPS reverse proxy (automatic SSL certificates)

All services are containerized using **Docker Compose**, configured for easy deployment and scalability.

---

## 🧠 System Architecture Overview

```
                    ┌─────────────────────────────────────────┐
                    │             Public Internet             │
                    └─────────────────────────────────────────┘
                                   │
                            [ HTTPS :443 ]
                                   │
                            ┌──────────────┐
                            │   Caddy SSL  │
                            └──────────────┘
                           /       |        \
                          /        |         \
                n8n (5678)   Evolution API (8080)   Ollama (11434)
                           \        |         /
                            \       |        /
                        PostgreSQL  |   Redis Cache
```

---

## 🧩 Prerequisites

Before you begin:

* **Docker** and **Docker Compose** installed
  [Install Docker](https://docs.docker.com/get-docker/)
* **Caddy** installed on the host machine
  [Install Caddy](https://caddyserver.com/docs/install)
* A domain name (e.g., `yourdomain.com`) pointing to your server’s public IP
* Open ports **80** and **443**

---

## 📁 Project Structure

```
n8n/
├── data/
│   ├── postgres/
│   └── redis/
├── docker-compose.yml
├── ollama-entrypoint.sh
├── .env
└── /etc/caddy/Caddyfile
```

---

## ⚙️ Environment Variables (`.env`)

```bash
# n8n configuration
N8N_ENCRYPTION_KEY=super-secret-key
N8N_USER_MANAGEMENT_JWT_SECRET=jwt-secret
N8N_DEFAULT_BINARY_DATA_MODE=filesystem

# Evolution API configuration
SERVER_URI=https://yourdomain.com/evolutionapi
AUTHENTICATION_API_KEY=your-secure-api-key
PORT=8080

# Database
DATABASE_ENABLED=true
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://postgres:StrongPassword@postgres:5432/evolution

# Redis Cache
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379/0
CACHE_REDIS_PREFIX_KEY=evolution_v2
CACHE_LOCAL_ENABLED=false
```

> ⚠️ **Never commit this `.env` file** to a public repository.

---

## 🐳 Docker Compose Configuration (`docker-compose.yml`)

```yaml
volumes:
  n8n_data:
  ollama_storage:
  evolution_instances:

services:
  n8n:
    image: docker.io/n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - WEBHOOK_URL=https://yourdomain.com/
      - VUE_APP_URL=https://yourdomain.com/
      - OLLAMA_HOST=https://yourdomain.com/ollamaapi
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - ollama-cpu

  ollama-cpu:
    image: ollama/ollama:latest
    container_name: ollama-cpu
    restart: always
    ports:
      - "11434:11434"
    volumes:
      - ollama_storage:/root/.ollama
    mem_limit: 1g
    mem_reservation: 512m

  ollama-pull:
    image: ollama/ollama:latest
    container_name: ollama-pull
    restart: on-failure
    depends_on:
      - ollama-cpu
    volumes:
      - ollama_storage:/root/.ollama
    entrypoint: /bin/sh
    environment:
      - OLLAMA_HOST=https://yourdomain.com/ollamaapi
    command:
      - -c
      - |
        sleep 3
        echo "⏬ Pulling required models..."
        ollama pull nomic-embed-text

  evolution-api:
    image: evoapicloud/evolution-api:latest
    container_name: evolution_api
    restart: always
    depends_on:
      - redis
      - postgres
    ports:
      - "8080:8080"
    volumes:
      - evolution_instances:/evolution/instances
    env_file:
      - .env

  postgres:
    image: postgres:15
    container_name: postgres
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=StrongPassword
      - POSTGRES_DB=evolution
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: redis
    volumes:
      - ./data/redis:/data

  evolution_manager:
    image: evoapicloud/evolution-manager:latest
    container_name: evolution_manager
    restart: always
    ports:
      - "3000:80"
```

---

## 🌐 Caddy SSL Reverse Proxy (`/etc/caddy/Caddyfile`)

```caddyfile
yourdomain.com {
    encode gzip

    handle_path /ollamaapi/* {
        reverse_proxy localhost:11434
    }

    handle_path /evolutionapi/* {
        reverse_proxy localhost:8080
    }

    handle {
        reverse_proxy localhost:5678
    }
}
```

**Caddy automatically provisions free HTTPS certificates** via Let’s Encrypt.

To start Caddy:

```bash
sudo systemctl enable caddy
sudo systemctl restart caddy
```

---

## 🧰 Managing and Updating

Pull updates and restart services:

```bash
docker compose pull
docker compose up -d
```

Stop all containers:

```bash
docker compose down
```

Clean volumes (⚠️ deletes data):

```bash
docker compose down -v
```


---

Would you like me to add a section showing how to connect **n8n workflows directly to Ollama and Evolution API endpoints** (so you can use AI inside n8n workflows seamlessly)? It’s a great addition for full automation.
