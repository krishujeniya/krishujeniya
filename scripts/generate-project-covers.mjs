import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 675;

// Helper: standard container resizing for 16:9 images
async function fitTo16x9(inputPath, outputPath, quality = 92) {
  const buf = fs.readFileSync(inputPath);
  await sharp(buf)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .webp({ quality, effort: 4 })
    .toFile(outputPath);
  console.log(`[OK] Generated ${outputPath} from ${inputPath}`);
}

async function run() {
  console.log('Generating high-definition 16:9 Google Labs-grade project covers...');

  // 1. AmberClaw (My Approach) -> amberclaw.webp
  await fitTo16x9(
    'public/images/contra_new/amberclaw_cover.jpg',
    'public/images/projects/amberclaw.webp'
  );

  // 2. Hadron -> hadron.webp
  // Hadron has a gorgeous 1200x630 vector social card; let's center it on #121317 1200x675
  const hadronSvgPath = '/home/ai/Documents/projects/Freelance/Hadron/assets/social-card.svg';
  if (fs.existsSync(hadronSvgPath)) {
    const hadronSvg = fs.readFileSync(hadronSvgPath, 'utf8');
    const hadronCard = await sharp(Buffer.from(hadronSvg)).resize(1200, 630).toBuffer();
    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 4,
        background: '#121317',
      },
    })
      .composite([{ input: hadronCard, top: 22, left: 0 }])
      .webp({ quality: 92 })
      .toFile('public/images/projects/hadron.webp');
    console.log('[OK] Generated public/images/projects/hadron.webp from vector social card');
  } else {
    await fitTo16x9(
      'public/images/contra_new/hadron_cover.jpg',
      'public/images/projects/hadron.webp'
    );
  }

  // 3. WaferPulse -> waferpulse.webp
  const waferPulseSvgPath = '/home/ai/Documents/projects/Freelance/WaferPulse/assets/social-card.svg';
  const waferPulseSvg = fs.readFileSync(waferPulseSvgPath, 'utf8');
  const waferCard = await sharp(Buffer.from(waferPulseSvg)).resize(1200, 630).toBuffer();
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: '#080c14',
    },
  })
    .composite([{ input: waferCard, top: 22, left: 0 }])
    .webp({ quality: 92 })
    .toFile('public/images/projects/waferpulse.webp');
  console.log('[OK] Generated public/images/projects/waferpulse.webp from vector social card');

  // 4. Somnostasis -> somnostasis.webp
  // Composite the official circular emblem with sleep ECG waveforms and dark emerald canvas
  const somnoEmblemPath = '/home/ai/Documents/projects/Freelance/somnostasis/reports/figures/somnostasis_logo_emblem.jpg';
  const somnoEmblemBuf = await sharp(somnoEmblemPath)
    .resize(320, 320, { fit: 'cover' })
    .composite([
      {
        input: Buffer.from(
          `<svg width="320" height="320"><rect width="320" height="320" rx="48" fill="#fff" /></svg>`
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const somnoBgSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#02080d" />
        <stop offset="50%" stop-color="#071b26" />
        <stop offset="100%" stop-color="#02080d" />
      </linearGradient>
      <radialGradient id="sglow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#02080d" stop-opacity="0" />
      </radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#06b6d4" flood-opacity="0.35" />
      </filter>
    </defs>
    <rect width="1200" height="675" fill="url(#sbg)" />
    <circle cx="600" cy="270" r="320" fill="url(#sglow)" />
    
    <!-- Sleep ECG Waveform Grid -->
    <path d="M 0 450 L 350 450 L 380 430 L 410 490 L 440 380 L 480 510 L 510 450 L 690 450 L 720 400 L 750 500 L 780 420 L 810 470 L 840 450 L 1200 450" 
          stroke="#0891b2" stroke-width="2" stroke-opacity="0.4" fill="none" />
    <path d="M 0 450 L 350 450 L 380 430 L 410 490 L 440 380 L 480 510 L 510 450 L 690 450 L 720 400 L 750 500 L 780 420 L 810 470 L 840 450 L 1200 450" 
          stroke="#22d3ee" stroke-width="1" stroke-opacity="0.7" fill="none" />

    <!-- Badges & Titles -->
    <text x="600" y="475" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#22d3ee" text-anchor="middle">
      AUTONOMIC BIOSIGNAL INTELLIGENCE
    </text>
    <text x="600" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="46" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      Somnostasis
    </text>
    <text x="600" y="565" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Sleep Stress Prediction · SHAP Explainability · Real-Time Drift Detection
    </text>
  </svg>
  `;

  await sharp(Buffer.from(somnoBgSvg))
    .composite([
      {
        input: somnoEmblemBuf,
        top: 105,
        left: 440,
      },
    ])
    .webp({ quality: 92 })
    .toFile('public/images/projects/somnostasis.webp');
  console.log('[OK] Generated public/images/projects/somnostasis.webp');

  // 5. Hajree (Biometric Attendance) -> face-lock.webp
  const hajreeSvg = fs.readFileSync('/home/ai/Documents/projects/Freelance/Hajree/assets/logo.svg', 'utf8');
  const hajreeLogoBuf = await sharp(Buffer.from(hajreeSvg))
    .resize(320, 320)
    .toBuffer();

  const hajreeBgSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#07070d" />
        <stop offset="50%" stop-color="#0f1124" />
        <stop offset="100%" stop-color="#07070d" />
      </linearGradient>
      <radialGradient id="hglow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#07070d" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#hbg)" />
    <circle cx="600" cy="265" r="340" fill="url(#hglow)" />

    <!-- Grid lines -->
    <path d="M 0 450 L 1200 450 M 0 200 L 1200 200" stroke="#6366f1" stroke-width="1" stroke-opacity="0.15" />
    <path d="M 300 0 L 300 675 M 900 0 L 900 675" stroke="#6366f1" stroke-width="1" stroke-opacity="0.15" />

    <text x="600" y="475" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#818cf8" text-anchor="middle">
      COMPUTER VISION &amp; ANTI-SPOOFING
    </text>
    <text x="600" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="46" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      Hajree Attendance
    </text>
    <text x="600" y="565" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Biometric Liveness Detection · Face Recognition · Sub-100ms Inference
    </text>
  </svg>
  `;

  await sharp(Buffer.from(hajreeBgSvg))
    .composite([
      {
        input: hajreeLogoBuf,
        top: 105,
        left: 440,
      },
    ])
    .webp({ quality: 92 })
    .toFile('public/images/projects/face-lock.webp');
  console.log('[OK] Generated public/images/projects/face-lock.webp');

  // 6. Curavex -> curavex.webp
  const curavexSvg = fs.readFileSync('/home/ai/Documents/projects/Freelance/curavex/frontend/assets/curavex-logo.svg', 'utf8');
  const curavexLogoBuf = await sharp(Buffer.from(curavexSvg))
    .resize(960, 240)
    .toBuffer();

  const curavexBgSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040c14" />
        <stop offset="50%" stop-color="#071b26" />
        <stop offset="100%" stop-color="#02080d" />
      </linearGradient>
      <radialGradient id="cglow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
        <stop offset="100%" stop-color="#02080d" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#cbg)" />
    <circle cx="600" cy="320" r="380" fill="url(#cglow)" />

    <!-- Molecular nodes connection network -->
    <g stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.3" fill="#0891b2">
      <line x1="150" y1="180" x2="300" y2="140" />
      <line x1="300" y1="140" x2="250" y2="280" />
      <line x1="900" y1="160" x2="1050" y2="220" />
      <line x1="1050" y1="220" x2="980" y2="340" />
      <circle cx="150" cy="180" r="5" />
      <circle cx="300" cy="140" r="7" />
      <circle cx="250" cy="280" r="6" />
      <circle cx="900" cy="160" r="6" />
      <circle cx="1050" cy="220" r="7" />
      <circle cx="980" cy="340" r="5" />
    </g>

    <text x="600" y="525" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="14" font-weight="800" letter-spacing="4" fill="#38bdf8" text-anchor="middle">
      PRECISION PHARMACOLOGY MLOPS PLATFORM
    </text>
    <text x="600" y="565" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Clinical Treatment Response · Dose Optimization · Model Governance
    </text>
  </svg>
  `;

  await sharp(Buffer.from(curavexBgSvg))
    .composite([
      {
        input: curavexLogoBuf,
        top: 200,
        left: 120,
      },
    ])
    .webp({ quality: 92 })
    .toFile('public/images/projects/curavex.webp');
  console.log('[OK] Generated public/images/projects/curavex.webp');

  // 7. Sureword -> sureword.webp
  const surewordSvg = fs.readFileSync('/home/ai/Documents/projects/Freelance/Sureword/assets/social-card.svg', 'utf8');
  const surewordCard = await sharp(Buffer.from(surewordSvg)).resize(1200, 600).toBuffer();
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: '#0a0d14',
    },
  })
    .composite([{ input: surewordCard, top: 37, left: 0 }])
    .webp({ quality: 92 })
    .toFile('public/images/projects/sureword.webp');
  console.log('[OK] Generated public/images/projects/sureword.webp');

  // 8. Scanlark -> snaptext.webp
  await fitTo16x9(
    'public/images/contra_new/snaptext_cover.jpg',
    'public/images/projects/snaptext.webp'
  );

  // 9. Saygrove -> echonest.webp
  await fitTo16x9(
    'public/images/contra_new/echonest_cover.jpg',
    'public/images/projects/echonest.webp'
  );

  // 10. Sensor Activity Recognition -> fitness-tracker.webp
  await fitTo16x9(
    'public/images/contra_new/fitness_tracker_cover.jpg',
    'public/images/projects/fitness-tracker.webp'
  );

  // 11. Salary Predictions -> m1.webp
  const salarySvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0f1d" />
        <stop offset="50%" stop-color="#141f36" />
        <stop offset="100%" stop-color="#090d1a" />
      </linearGradient>
      <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#6366f1" />
        <stop offset="50%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#10b981" />
      </linearGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#mbg)" />

    <!-- Grid & Regression Plot Area -->
    <rect x="100" y="100" width="1000" height="340" rx="20" fill="#080c16" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
    
    <!-- Coordinate axes -->
    <line x1="160" y1="140" x2="160" y2="400" stroke="#334155" stroke-width="2" />
    <line x1="160" y1="400" x2="1040" y2="400" stroke="#334155" stroke-width="2" />

    <!-- Confidence Band Fill -->
    <path d="M 160 360 Q 400 320 600 240 T 1040 160 L 1040 220 Q 800 280 600 300 T 160 390 Z" fill="#38bdf8" fill-opacity="0.12" />

    <!-- Regression Curve -->
    <path d="M 160 375 Q 400 335 600 260 T 1040 180" stroke="url(#lineGrad)" stroke-width="5" fill="none" stroke-linecap="round" />

    <!-- Data Points Scatter -->
    <g fill="#38bdf8">
      <circle cx="240" cy="360" r="5" />
      <circle cx="320" cy="340" r="6" />
      <circle cx="420" cy="310" r="6.5" />
      <circle cx="530" cy="290" r="5.5" />
      <circle cx="640" cy="250" r="7" />
      <circle cx="730" cy="235" r="6" />
      <circle cx="850" cy="210" r="6.5" />
      <circle cx="950" cy="190" r="7" />
    </g>

    <!-- Metrics Overlay Badges -->
    <g transform="translate(740, 130)">
      <rect width="260" height="70" rx="14" fill="#0f172a" stroke="rgba(56,189,248,0.3)" stroke-width="1" />
      <text x="20" y="30" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#94a3b8">RMSE: $4,120</text>
      <text x="140" y="30" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#10b981">R²: 0.942</text>
      <text x="20" y="54" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#38bdf8">SHAP Top-1: Experience</text>
    </g>

    <text x="600" y="505" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#38bdf8" text-anchor="middle">
      PRODUCTION MLOPS ENGINE
    </text>
    <text x="600" y="555" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      Salary Predictions Pipeline
    </text>
    <text x="600" y="595" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      End-to-End Regression · Automated Feature Engineering · Model Registry
    </text>
  </svg>
  `;
  await sharp(Buffer.from(salarySvg))
    .webp({ quality: 92 })
    .toFile('public/images/m1.webp');
  console.log('[OK] Generated public/images/m1.webp');

  // 12. AGYOS -> agyos.webp
  const agyosSvg = fs.readFileSync('/home/ai/Documents/projects/Freelance/AGYOS/docs/assets/social-card.svg', 'utf8');
  const agyosCard = await sharp(Buffer.from(agyosSvg)).resize(1200, 600).toBuffer();
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: '#090a0f',
    },
  })
    .composite([{ input: agyosCard, top: 37, left: 0 }])
    .webp({ quality: 92 })
    .toFile('public/images/projects/agyos.webp');
  console.log('[OK] Generated public/images/projects/agyos.webp');

  // 13. Discord Bot -> discord-bot.webp
  const discordOldBuf = await sharp('public/images/projects/discord-bot.webp')
    .resize(280, 280)
    .composite([
      {
        input: Buffer.from(
          `<svg width="280" height="280"><circle cx="140" cy="140" r="140" fill="#fff" /></svg>`
        ),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  const discordSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a14" />
        <stop offset="50%" stop-color="#151733" />
        <stop offset="100%" stop-color="#0a0a14" />
      </linearGradient>
      <radialGradient id="dglow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#5865F2" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#0a0a14" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#dbg)" />
    <circle cx="600" cy="245" r="320" fill="url(#dglow)" />

    <!-- Ambient glowing orbit ring -->
    <circle cx="600" cy="245" r="170" stroke="#5865F2" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="6 8" fill="none" />

    <text x="600" y="450" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#5865F2" text-anchor="middle">
      DISTRIBUTED AUTOMATION BOT
    </text>
    <text x="600" y="505" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      Discord Community Bot
    </text>
    <text x="600" y="545" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Event Ingestion · Gateway Sharding · Auto-Moderation Engine
    </text>
  </svg>
  `;

  await sharp(Buffer.from(discordSvg))
    .composite([
      {
        input: discordOldBuf,
        top: 105,
        left: 460,
      },
    ])
    .webp({ quality: 92 })
    .toFile('public/images/projects/discord-bot.webp');
  console.log('[OK] Generated public/images/projects/discord-bot.webp');

  // 14. SparkWA -> sparkwa.webp
  const sparkMarkSvg = fs.readFileSync('/tmp/sparkwa_assets/sparkwa-mark.svg', 'utf8');
  const sparkMarkBuf = await sharp(Buffer.from(sparkMarkSvg))
    .resize(240, 240)
    .toBuffer();

  const sparkBgSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#02120b" />
        <stop offset="50%" stop-color="#072b1b" />
        <stop offset="100%" stop-color="#02120b" />
      </linearGradient>
      <radialGradient id="spglow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#25D366" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#02120b" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#spbg)" />
    <circle cx="600" cy="240" r="320" fill="url(#spglow)" />

    <!-- WhatsApp bridge pulse -->
    <circle cx="600" cy="240" r="160" stroke="#25D366" stroke-width="1.5" stroke-opacity="0.4" fill="none" />

    <text x="600" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#25D366" text-anchor="middle">
      HEADLESS WHATSAPP AI BRIDGE
    </text>
    <text x="600" y="500" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      SparkWA
    </text>
    <text x="600" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Google Gemini Multi-Modal Ingestion · SQLite Context Store · Zero Memory Leaks
    </text>
  </svg>
  `;

  await sharp(Buffer.from(sparkBgSvg))
    .composite([
      {
        input: sparkMarkBuf,
        top: 120,
        left: 480,
      },
    ])
    .webp({ quality: 92 })
    .toFile('public/images/projects/sparkwa.webp');
  console.log('[OK] Generated public/images/projects/sparkwa.webp');

  // 15. NetSweep -> netsweep.webp
  await fitTo16x9(
    'public/images/projects/netsweep.webp',
    'public/images/projects/netsweep.webp'
  );

  console.log('All 15 project covers successfully generated at 1200x675!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
