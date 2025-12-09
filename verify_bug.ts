
import * as fs from 'fs';

const filePath = 'src/components/sections/about-section.tsx';
const content = fs.readFileSync(filePath, 'utf-8');

const usesCn = /cn\(/.test(content);
const importsCn = /import\s+\{\s*cn\s*\}\s+from\s+['"]@\/lib\/utils['"]/.test(content);

if (usesCn && !importsCn) {
  console.log('BUG DETECTED: "cn" is used but not imported.');
  process.exit(1);
} else if (!usesCn) {
  console.log('"cn" is not used in the file.');
} else {
  console.log('BUG FIXED: "cn" is used and imported correctly.');
}
