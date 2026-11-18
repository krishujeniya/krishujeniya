import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 675;
const LOGO_COLLECTION_DIR = process.env.LOGO_COLLECTION_DIR
  || (fs.existsSync(path.resolve(process.cwd(), '../../Monochrome_3D_Logo_Collection'))
    ? path.resolve(process.cwd(), '../../Monochrome_3D_Logo_Collection')
    : path.resolve(process.cwd(), '../Monochrome_3D_Logo_Collection'));
const LOGOS_4K_DIR = path.join(LOGO_COLLECTION_DIR, '4K_3D_Logos');
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/images/projects');

/**
 * Transforms a 2160x3840 4K 3D monochrome portrait into a razor-sharp 16:9
 * 1200x675 WebP project cover centered on a pure black (#000000) canvas.
 */
async function generate4KCover(sourceFileName, outputPaths) {
  const sourcePath = path.join(LOGOS_4K_DIR, sourceFileName);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source 4K logo not found: ${sourcePath}`);
  }

  // Trim black background padding to isolate the 3D relief emblem
  const trimmed = await sharp(sourcePath)
    .trim({ background: '#000000', threshold: 10 })
    .toBuffer({ resolveWithObject: true });

  // Scale emblem to fit gracefully in 16:9 frame with generous margin
  const resized = await sharp(trimmed.data)
    .resize({
      width: 780,
      height: 490,
      fit: 'inside',
    })
    .toBuffer({ resolveWithObject: true });

  // Center onto pitch-black 1200x675 canvas
  const top = Math.round((HEIGHT - resized.info.height) / 2);
  const left = Math.round((WIDTH - resized.info.width) / 2);

  const finalWebpBuffer = await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .composite([{ input: resized.data, top, left }])
    .webp({ quality: 95, effort: 4 })
    .toBuffer();

  const paths = Array.isArray(outputPaths) ? outputPaths : [outputPaths];
  for (const p of paths) {
    const fullPath = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, finalWebpBuffer);
    console.log(`[OK] Generated 16:9 4K cover: ${p} (from ${sourceFileName})`);
  }
}

async function run() {
  console.log('Generating high-definition 16:9 project covers from Monochrome 3D Logo Collection...');

  const mappings = [
    // 01. AmberClaw
    {
      source: '01_AmberClaw_4K.png',
      targets: ['public/images/projects/amberclaw.webp'],
    },
    // 02. AGYOS
    {
      source: '02_AGYOS_4K.png',
      targets: ['public/images/projects/agyos.webp'],
    },
    // 03. Curavex
    {
      source: '03_Curavex_4K.png',
      targets: ['public/images/projects/curavex.webp'],
    },
    // 04. Sureword
    {
      source: '04_Sureword_4K.png',
      targets: ['public/images/projects/sureword.webp'],
    },
    // 05. Hajree
    {
      source: '05_Hajree_4K.png',
      targets: [
        'public/images/projects/hajree.webp',
        'public/images/projects/face-lock.webp',
      ],
    },
    // 06. Hadron
    {
      source: '06_Hadron_4K.png',
      targets: ['public/images/projects/hadron.webp'],
    },
    // 07. Scanlark
    {
      source: '07_Scanlark_4K.png',
      targets: [
        'public/images/projects/scanlark.webp',
        'public/images/projects/snaptext.webp',
      ],
    },
    // 08. WaferPulse
    {
      source: '08_WaferPulse_4K.png',
      targets: ['public/images/projects/waferpulse.webp'],
    },
    // 09. Somnostasis
    {
      source: '09_Somnostasis_4K.png',
      targets: ['public/images/projects/somnostasis.webp'],
    },
    // 10. Saygrove
    {
      source: '10_Saygrove_4K.png',
      targets: [
        'public/images/projects/saygrove.webp',
        'public/images/projects/echonest.webp',
      ],
    },
    // 12. Strange (Discord bot archive)
    {
      source: '12_Strange_4K.png',
      targets: [
        'public/images/projects/discord-bot.webp',
        'public/images/projects/strange.webp',
      ],
    },
    // 13. NetSweep
    {
      source: '13_NetSweep_4K.png',
      targets: ['public/images/projects/netsweep.webp'],
    },
    // 14. Salary Prediction
    {
      source: '14_Salary_Prediction_4K.png',
      targets: [
        'public/images/projects/salary-predictions.webp',
        'public/images/m1.webp',
      ],
    },
    // 15. Fitness Recognition
    {
      source: '15_Fitness_Recognition_4K.png',
      targets: [
        'public/images/projects/fitness-tracker.webp',
        'public/images/projects/fitness-recognition.webp',
      ],
    },
  ];

  for (const item of mappings) {
    await generate4KCover(item.source, item.targets);
  }

  // 16. SparkWA (Monochrome 3D Bridge Mark on pitch-black 16:9 canvas)
  const sparkSvg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="chromeFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="35%" stop-color="#e2e8f0" />
        <stop offset="70%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
      <linearGradient id="beveledRim" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#64748b" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#0f172a" stop-opacity="0.8" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect width="1200" height="675" fill="#000000" />
    <circle cx="600" cy="337" r="320" fill="url(#coreGlow)" />
    <g transform="translate(380, 117)">
      <rect width="440" height="440" rx="96" fill="#080808" stroke="url(#beveledRim)" stroke-width="8" />
      <rect x="12" y="12" width="416" height="416" rx="84" fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.15" />
      <g transform="translate(37, 37) scale(3.8)" fill="none" stroke="url(#chromeFace)" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 33v30" stroke-width="6" filter="url(#glow)" />
        <path d="M76 33v30" stroke-width="6" filter="url(#glow)" />
        <path d="M25 48h15l10-22-2 22h19L42 74l3-26" stroke-width="5.5" filter="url(#glow)" />
        <circle cx="20" cy="24" r="4" fill="#ffffff" stroke="none" />
        <circle cx="76" cy="72" r="4" fill="#ffffff" stroke="none" />
      </g>
    </g>
  </svg>`;

  await sharp(Buffer.from(sparkSvg))
    .webp({ quality: 95, effort: 4 })
    .toFile('public/images/projects/sparkwa.webp');
  console.log('[OK] Generated 16:9 4K cover: public/images/projects/sparkwa.webp (SparkWA Bridge Mark)');

  console.log(`[SUCCESS] All ${mappings.length} project covers generated from Monochrome 3D Logo Collection.`);
}

run().catch((err) => {
  console.error('[ERROR] Cover generation failed:', err);
  process.exit(1);
});
