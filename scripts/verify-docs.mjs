import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

console.log('Running document allowlist and integrity verification...');

const manifestPath = path.resolve(process.cwd(), 'public/docs-manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('[FAIL] public/docs-manifest.json not found!');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
let integrityFailures = 0;

for (const [relPath, meta] of Object.entries(manifest.files)) {
  const fullPath = path.resolve(process.cwd(), 'Docs', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Manifested document missing: ${relPath}`);
    integrityFailures++;
    continue;
  }
  const buf = fs.readFileSync(fullPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  if (hash !== meta.sha256) {
    console.error(`[FAIL] SHA-256 mismatch for ${relPath}: expected ${meta.sha256}, got ${hash}`);
    integrityFailures++;
  }
}

if (integrityFailures > 0) {
  console.error(`[FAIL] ${integrityFailures} document integrity check(s) failed.`);
  process.exit(1);
}

// Check for forbidden file patterns (.zip, .docx, .doc, .exe, .tar, .key, .env) in Docs/
function checkForbidden(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkForbidden(full);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.zip', '.docx', '.doc', '.exe', '.tar', '.gz', '.key', '.pfx', '.pem'].includes(ext)) {
        console.error(`[FAIL] Forbidden file type found under Docs: ${full}`);
        process.exit(1);
      }
    }
  }
}

checkForbidden(path.resolve(process.cwd(), 'Docs'));
console.log(`[PASS] Document verification passed: all ${Object.keys(manifest.files).length} approved documents verified.`);
