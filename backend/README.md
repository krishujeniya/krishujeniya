# Krish Ujeniya Portfolio Backend

FastAPI inquiry service and idempotent delivery engine for [krishujeniya](https://github.com/krishujeniya/krishujeniya).

## Architecture

- **Framework**: FastAPI (Python 3.12)
- **Database**: MongoDB Atlas (`portfolio.contact_inquiries`, `portfolio.rate_limits`)
- **Email Delivery**: SMTP over TLS with Gmail
- **Supported Frontends**:
  - `https://krishujeniya.github.io` (GitHub Pages)
  - `https://krishujeniya.pages.dev` (Cloudflare Pages)

## Security Controls

1. **Origin & Referer Validation**: Strict HTTPS verification restricted to verified hostnames (`krishujeniya.github.io` and `krishujeniya.pages.dev`).
2. **IP Rate Limiting**: Dual-layer IP rate limiting utilizing `CF-Connecting-IP` (Cloudflare) and `x-vercel-forwarded-for` (Vercel).
3. **Idempotency**: Cryptographic SHA-256 HMAC payload hashing prevents duplicate form submissions.
4. **Honeypot Bot Detection**: Hidden form input triggers silent bot filtering.
5. **Bounded Inputs**: Pydantic models enforce string length constraints and sanitization.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `EMAIL_USER`: Outbound sender email address
- `EMAIL_PASS`: Gmail App password
- `IDEMPOTENCY_HASH_SECRET`: Secret key for HMAC payload hashing
- `CRON_SECRET`: Bearer token for scheduled retry executions
