# Deployment Guide — krishujeniya

> Operational Runbook for Production Deployment, Health Verification, and Rollbacks.
> Standardized across the project suite in conformance with deployment engineering patterns.

---

## 1. Architecture & Production Topology

**Application Type**: Personal Portfolio & Engineering Showcase Website

### Declared Service Topology
- **Cloudflare Pages Edge**: Global edge CDN serving static export on free tier at `https://krishujeniya.pages.dev/` (Root apex served directly; legacy `/krishujeniya/` redirects to `/`).
- **GitHub Pages**: Static hosting at `https://krishujeniya.github.io/krishujeniya/` deployed via GitHub Actions.
- **`krishujeniya_portfolio`**: Nginx 1.27 Alpine serving Next.js static export at /krishujeniya/ (Port: `9002 (mapped from 80)`).

All container services are orchestrated via `docker-compose.yml` with isolated internal bridge networking, non-root system users (uid 1001), and layer-cached multi-stage container builds.

---

## 2. Environment Configuration

Supply environment variables via a secure `.env` file (or CI/CD secrets manager). Never commit plaintext credentials to Git.

### Key Environment Variables
- `PORT (default 80)`: Local container mapped port.
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with `Cloudflare Pages: Edit` permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account identifier.

---

## 3. Deployment Procedures

### Method A: Single-Host / VPS Deployment (Docker Compose)

1. **Clone repository on host**:
   ```bash
   git clone https://github.com/krishujeniya/krishujeniya.git
   cd krishujeniya
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env # edit with production secrets
   ```

3. **Start stack in detached mode**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify container health and logs**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Method B: Pre-built Container Registry Deployment (GHCR)

Pre-built multi-stage production images are published automatically via GitHub Actions:
```bash
docker pull ghcr.io/krishujeniya/krishujeniya:latest
docker run -d --restart unless-stopped -p 9002:9002 ghcr.io/krishujeniya/krishujeniya:latest
```

### Method C: Cloudflare Pages Deployment (Free Tier — CLI & CI/CD)

Cloudflare Pages provides unlimited bandwidth, global CDN caching, and automatic SSL on the free tier.

#### C1. Automated GitHub Actions Deployment via CLI

1. **Authenticate Wrangler CLI locally**:
   ```bash
   wrangler login
   wrangler whoami
   ```

2. **Create the Pages project via Wrangler CLI**:
   ```bash
   wrangler pages project create krishujeniya --production-branch=main
   ```

3. **Inject secrets into GitHub repository via GitHub CLI**:
   ```bash
   gh secret set CLOUDFLARE_API_TOKEN
   gh secret set CLOUDFLARE_ACCOUNT_ID
   ```

4. **Trigger automated CI build and deployment**:
   ```bash
   gh workflow run deploy-cloudflare.yml
   gh run watch
   ```

#### C2. Direct Terminal Deployment (Manual / Emergency)

When static files are built and you need an immediate direct deploy from your terminal:
```bash
npm run cf:deploy
```

#### C3. Zero-Secret Cloudflare Dashboard Git Connection (Alternative)

If you prefer not to manage GitHub Actions tokens:
1. Open Cloudflare Dashboard -> **Compute (Workers & Pages)** -> **Create application** -> **Pages** -> **Connect to Git**.
2. Select repository `krishujeniya/krishujeniya`.
3. Set build configuration:
   - Framework preset: `Next.js (Static HTML Export)` or `None`
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: `NODE_VERSION=22`
4. Deploy site. Every subsequent push to `main` builds and deploys automatically for free.

---

## 4. Health Check & Readiness Probes

### Local / VPS Verification Probe
```bash
curl -f http://localhost:9002/healthz
```
Expected HTTP Response: `200 OK`

### Cloudflare Pages Verification Probes
```bash
# 1. Verify apex 301 redirect
curl -sI https://krishujeniya.pages.dev/ | grep -E "(HTTP|location)"

# 2. Verify subpath 200 response and security headers
curl -sI https://krishujeniya.pages.dev/krishujeniya/ | grep -E "(HTTP|x-frame-options|x-content-type-options)"

# 3. Verify static asset rewrite
curl -sI https://krishujeniya.pages.dev/krishujeniya/images/projects/amberclaw.webp | grep HTTP

# 4. Interactive published smoke test
PAGE_URL=https://krishujeniya.pages.dev/krishujeniya/ npm run test:smoke
```

---

## 5. Rollback Procedures

If an anomaly, regression, or service failure is detected:

### Cloudflare Pages Instant Rollback
Rollback in Cloudflare Pages is instant and non-destructive:
```bash
# List past deployments
wrangler pages deployment list --project-name=krishujeniya

# Roll back via Cloudflare dashboard:
# Pages -> krishujeniya -> Deployments -> Select known good deployment -> "Rollback to this deployment"
```

### Container Rollback
```bash
# Pull previous known healthy SHA tag
docker pull ghcr.io/krishujeniya/krishujeniya:sha-<previous-commit-sha>

# Or revert compose to previous git revision
git checkout <previous-stable-tag>
docker compose up -d
```

---

## 6. Pre-Flight & Post-Flight Quality Gates

Follow the 4-phase verification protocol before declaring a release complete:

- [ ] **Code Quality**: Static inspection passed; zero lint or AST warnings.
- [ ] **Build Reproducibility**: Container builds cleanly via multi-stage isolation without dev dependencies.
- [ ] **Environment Validation**: All required environment variables present; secrets injected via secrets manager.
- [ ] **Safety & Probes**: Healthcheck endpoints respond with `200 OK`; rollback target verified.
