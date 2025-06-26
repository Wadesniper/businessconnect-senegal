const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, 'src/assets'),
  path.join(__dirname, 'public/images'),
];
const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const MIN_SIZE = 300 * 1024; // 300 Ko

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walk(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

async function compressImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!EXTENSIONS.includes(ext)) return;
  const stat = fs.statSync(file);
  if (stat.size < MIN_SIZE) return;
  const out = file.replace(ext, '.webp');
  if (fs.existsSync(out)) return; // Ne pas écraser
  try {
    await sharp(file)
      .webp({ quality: 75 })
      .toFile(out);
    const newSize = fs.statSync(out).size;
    console.log(`Compressé: ${path.basename(file)} (${(stat.size/1024).toFixed(0)} Ko → ${(newSize/1024).toFixed(0)} Ko)`);
  } catch (e) {
    console.error('Erreur compression', file, e);
  }
}

(async () => {
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = walk(dir);
    for (const file of files) {
      await compressImage(file);
    }
  }
  console.log('Compression terminée. Les .webp sont à côté des originaux.');
})();