import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 675;
const FREELANCE_DIR = process.env.PROJECTS_DIR || path.resolve(process.cwd(), '../Freelance');

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
    'assets/images/contra_new/amberclaw_cover.jpg',
    'public/images/projects/amberclaw.webp'
  );

  // 2. Hadron -> hadron.webp
  // Hadron has a gorgeous 1200x630 vector social card; let's center it on #121317 1200x675
  const hadronSvgPath = path.join(FREELANCE_DIR, 'Hadron/assets/social-card.svg');
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
  } else if (fs.existsSync('assets/images/contra_new/hadron_cover.jpg')) {
    await fitTo16x9(
      'assets/images/contra_new/hadron_cover.jpg',
      'public/images/projects/hadron.webp'
    );
  }

  // 3. WaferPulse -> waferpulse.webp
  const waferPulseSvgPath = path.join(FREELANCE_DIR, 'WaferPulse/assets/social-card.svg');
  if (fs.existsSync(waferPulseSvgPath)) {
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
  } else {
    const waferFallbackSvg = `
    <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wfbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#080c14" />
          <stop offset="50%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#080c14" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" fill="url(#wfbg)" />
      <circle cx="600" cy="240" r="140" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.5" />
      <circle cx="600" cy="240" r="100" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.3" />
      <circle cx="600" cy="240" r="60" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.4" />
      <text x="600" y="445" font-family="-apple-system, sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#38bdf8" text-anchor="middle">SEMICONDUCTOR TELEMETRY ML</text>
      <text x="600" y="500" font-family="-apple-system, sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">WaferPulse</text>
      <text x="600" y="540" font-family="-apple-system, sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">Real-Time Sensor Ingestion · Defect Pattern Classification</text>
    </svg>`;
    await sharp(Buffer.from(waferFallbackSvg)).webp({ quality: 92 }).toFile('public/images/projects/waferpulse.webp');
    console.log('[OK] Generated public/images/projects/waferpulse.webp from standalone vector SVG');
  }

  // 4. Somnostasis -> somnostasis.webp
  // Composite the official circular emblem with sleep ECG waveforms and dark emerald canvas
  const somnoEmblemPath = path.join(FREELANCE_DIR, 'somnostasis/reports/figures/somnostasis_logo_emblem.jpg');
  let somnoEmblemBuf;
  if (fs.existsSync(somnoEmblemPath)) {
    somnoEmblemBuf = await sharp(somnoEmblemPath)
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
  } else {
    somnoEmblemBuf = await sharp(
      Buffer.from(
        `<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="320" rx="48" fill="#071b26" stroke="#06b6d4" stroke-width="4" />
          <path d="M 40 160 L 90 160 L 110 110 L 140 220 L 170 80 L 200 240 L 220 160 L 280 160" stroke="#22d3ee" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="170" cy="80" r="10" fill="#38bdf8" />
        </svg>`
      )
    )
      .png()
      .toBuffer();
  }

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
  const hajreeSvgPath = path.join(FREELANCE_DIR, 'Hajree/assets/logo.svg');
  let hajreeLogoBuf;
  if (fs.existsSync(hajreeSvgPath)) {
    const hajreeSvg = fs.readFileSync(hajreeSvgPath, 'utf8');
    hajreeLogoBuf = await sharp(Buffer.from(hajreeSvg))
      .resize(320, 320)
      .toBuffer();
  } else {
    hajreeLogoBuf = await sharp(
      Buffer.from(
        `<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
          <rect width="320" height="320" rx="48" fill="#0f1124" stroke="#6366f1" stroke-width="4" />
          <circle cx="160" cy="130" r="45" fill="none" stroke="#818cf8" stroke-width="6" />
          <path d="M 100 240 C 100 195 130 185 160 185 C 190 185 220 195 220 240" fill="none" stroke="#818cf8" stroke-width="6" stroke-linecap="round" />
          <rect x="75" y="75" width="40" height="40" fill="none" stroke="#6366f1" stroke-width="5" />
          <rect x="205" y="75" width="40" height="40" fill="none" stroke="#6366f1" stroke-width="5" />
          <rect x="75" y="205" width="40" height="40" fill="none" stroke="#6366f1" stroke-width="5" />
          <rect x="205" y="205" width="40" height="40" fill="none" stroke="#6366f1" stroke-width="5" />
        </svg>`
      )
    )
      .png()
      .toBuffer();
  }

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
  const curavexSvgPath = path.join(FREELANCE_DIR, 'curavex/frontend/assets/curavex-logo.svg');
  let curavexLogoBuf;
  if (fs.existsSync(curavexSvgPath)) {
    const curavexSvg = fs.readFileSync(curavexSvgPath, 'utf8');
    curavexLogoBuf = await sharp(Buffer.from(curavexSvg))
      .resize(960, 240)
      .toBuffer();
  } else {
    curavexLogoBuf = await sharp(
      Buffer.from(
        `<svg width="960" height="240" viewBox="0 0 960 240" xmlns="http://www.w3.org/2000/svg">
          <text x="480" y="160" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="96" font-weight="900" letter-spacing="-2" fill="#38bdf8" text-anchor="middle">
            CURAVEX
          </text>
        </svg>`
      )
    )
      .png()
      .toBuffer();
  }

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
  const surewordSvgPath = path.join(FREELANCE_DIR, 'Sureword/assets/social-card.svg');
  if (fs.existsSync(surewordSvgPath)) {
    const surewordSvg = fs.readFileSync(surewordSvgPath, 'utf8');
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
  }

  // 8. Scanlark -> snaptext.webp
  await fitTo16x9(
    'assets/images/contra_new/snaptext_cover.jpg',
    'public/images/projects/snaptext.webp'
  );

  // 9. Saygrove -> echonest.webp
  await fitTo16x9(
    'assets/images/contra_new/echonest_cover.jpg',
    'public/images/projects/echonest.webp'
  );

  // 10. Sensor Activity Recognition -> fitness-tracker.webp
  await fitTo16x9(
    'assets/images/contra_new/fitness_tracker_cover.jpg',
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
  const agyosSvgPath = path.join(FREELANCE_DIR, 'AGYOS/docs/assets/social-card.svg');
  if (fs.existsSync(agyosSvgPath)) {
    const agyosSvg = fs.readFileSync(agyosSvgPath, 'utf8');
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
  }

  // 13. Discord Bot -> discord-bot.webp (Standalone vector SVG)
  const discordSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a0a14" />
        <stop offset="50%" stop-color="#151733" />
        <stop offset="100%" stop-color="#0a0a14" />
      </linearGradient>
      <radialGradient id="dglow" cx="50%" cy="38%" r="45%">
        <stop offset="0%" stop-color="#5865F2" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#0a0a14" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#dbg)" />
    <circle cx="600" cy="245" r="320" fill="url(#dglow)" />

    <!-- Ambient glowing orbit ring -->
    <circle cx="600" cy="245" r="170" stroke="#5865F2" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="6 8" fill="none" />

    <!-- Vector Discord Mascot Badge -->
    <g transform="translate(470, 115)">
      <circle cx="130" cy="130" r="110" fill="#5865F2" />
      <path d="M178 88c-12-5.5-25-9.5-38.5-11.5-.5 1-1 2.2-1.5 3.5-14.5-2.2-29-2.2-43.5 0-.5-1.3-1-2.5-1.5-3.5-13.5 2-26.5 6-38.5 11.5-24 35.5-30.5 70-27.5 104 16 11.8 31.5 19 46.5 23.8 3.8-5.1 7.1-10.6 9.9-16.5-5.5-2-10.7-4.7-15.6-7.9 1.3-.9 2.6-1.9 3.8-2.9 30.5 14 63.5 14 93.6 0 1.2 1 2.5 2 3.8 2.9-4.9 3.2-10.1 5.9-15.6 7.9 2.8 5.8 6.1 11.3 9.9 16.5 15-4.8 30.5-12 46.5-23.8 3.8-39-6.5-73.5-27.5-104.4zm-75 79c-8.8 0-16-8-16-18s7-18 16-18 16.2 8 16 18c0 10-7 18-16 18zm54 0c-8.8 0-16-8-16-18s7-18 16-18 16.2 8 16 18c0 10-7.2 18-16 18z" fill="#ffffff" />
    </g>

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
    .webp({ quality: 92 })
    .toFile('public/images/projects/discord-bot.webp');
  console.log('[OK] Generated public/images/projects/discord-bot.webp');

  // 14. SparkWA -> sparkwa.webp (Standalone vector SVG)
  const sparkBgSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="spbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#02120b" />
        <stop offset="50%" stop-color="#072b1b" />
        <stop offset="100%" stop-color="#02120b" />
      </linearGradient>
      <radialGradient id="spglow" cx="50%" cy="38%" r="45%">
        <stop offset="0%" stop-color="#25D366" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#02120b" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#spbg)" />
    <circle cx="600" cy="240" r="320" fill="url(#spglow)" />

    <!-- WhatsApp bridge pulse -->
    <circle cx="600" cy="240" r="160" stroke="#25D366" stroke-width="1.5" stroke-opacity="0.4" fill="none" />

    <!-- Vector WhatsApp & AI Spark Icon Badge -->
    <g transform="translate(485, 125)">
      <circle cx="115" cy="115" r="95" fill="#25D366" />
      <path d="M152 78c-10-10-23.2-15.5-37-15.5-28.8 0-52.2 23.4-52.2 52.2 0 9.2 2.4 18.2 7 26.1l-7.4 27.2 27.8-7.3c7.6 4.1 16.1 6.3 24.8 6.3h.1c28.8 0 52.2-23.4 52.2-52.2 0-13.8-5.4-27-15.3-36.8zm-37 88.5h-.1c-7.8 0-15.4-2.1-22.1-6.1l-1.6-.9-16.5 4.3 4.4-16.1-1-1.6c-4.4-7-6.7-15-6.7-23.3 0-24 19.5-43.5 43.6-43.5 11.6 0 22.6 4.5 30.8 12.8 8.2 8.3 12.7 19.2 12.7 30.8 0 24-19.5 43.6-43.5 43.6z" fill="#ffffff" />
    </g>

    <text x="600" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#25D366" text-anchor="middle">
      HEADLESS WHATSAPP AI BRIDGE
    </text>
    <text x="600" y="500" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      SparkWA
    </text>
    <text x="600" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Google Gemini Multi-Modal Ingestion · Gmail Event Dispatcher · Sub-400ms Daemon
    </text>
  </svg>
  `;

  await sharp(Buffer.from(sparkBgSvg))
    .webp({ quality: 92 })
    .toFile('public/images/projects/sparkwa.webp');
  console.log('[OK] Generated public/images/projects/sparkwa.webp');

  // 15. NetSweep -> netsweep.webp (Standalone vector SVG)
  const netSweepSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nsbg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#030712" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#030712" />
      </linearGradient>
      <radialGradient id="nsglow" cx="50%" cy="38%" r="45%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#030712" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="675" fill="url(#nsbg)" />
    <circle cx="600" cy="240" r="320" fill="url(#nsglow)" />

    <!-- Radar scan grid -->
    <circle cx="600" cy="240" r="160" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.4" fill="none" />
    <circle cx="600" cy="240" r="110" stroke="#06b6d4" stroke-width="1" stroke-dasharray="6 6" stroke-opacity="0.3" fill="none" />
    <circle cx="600" cy="240" r="60" stroke="#06b6d4" stroke-width="1" stroke-opacity="0.4" fill="none" />
    <line x1="440" y1="240" x2="760" y2="240" stroke="#06b6d4" stroke-width="1" stroke-opacity="0.3" />
    <line x1="600" y1="80" x2="600" y2="400" stroke="#06b6d4" stroke-width="1" stroke-opacity="0.3" />

    <!-- Discovered host nodes on radar -->
    <circle cx="670" cy="180" r="6" fill="#22d3ee" />
    <circle cx="540" cy="290" r="5" fill="#38bdf8" />
    <circle cx="620" cy="310" r="4" fill="#06b6d4" />
    <circle cx="510" cy="200" r="5.5" fill="#22d3ee" />

    <text x="600" y="445" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="13" font-weight="800" letter-spacing="4" fill="#06b6d4" text-anchor="middle">
      AUTOMATED NETWORK RECONNAISSANCE
    </text>
    <text x="600" y="500" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="44" font-weight="900" letter-spacing="-1" fill="#f8fafc" text-anchor="middle">
      NetSweep
    </text>
    <text x="600" y="540" font-family="-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" font-size="17" font-weight="500" fill="#94a3b8" text-anchor="middle">
      Multi-Subnet Discovery · Port Auditing · Automated Vulnerability Mapping
    </text>
  </svg>
  `;

  await sharp(Buffer.from(netSweepSvg))
    .webp({ quality: 92 })
    .toFile('public/images/projects/netsweep.webp');
  console.log('[OK] Generated public/images/projects/netsweep.webp');

  console.log('All 15 project covers successfully generated at 1200x675!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
