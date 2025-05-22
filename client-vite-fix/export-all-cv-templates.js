// Script d'export automatique de tous les templates de CV en PNG A4 complet
// Nécessite: npm install puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Adapter ici le port si Vite démarre sur un autre port (ex: 5174)
const BASE_URL = 'http://localhost:5174/cv-generator?template=';
const EXPORT_DIR = path.join(__dirname, 'public', 'images', 'cv-templates');

// Liste des IDs de templates à exporter (doit correspondre à CV_TEMPLATES)
const TEMPLATE_IDS = [
  'finance', 'marketing', 'health', 'education', 'commerce', 'admin', 'tech',
  'logistics', 'btp', 'art', 'hotel', 'law', 'com', 'agro', 'human', 'bank', 'tech-modern'
];

(async () => {
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (const id of TEMPLATE_IDS) {
    const url = `${BASE_URL}${id}&exportMode=1`;
    console.log('Export du template:', id, url);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    // Attendre que le CV soit bien rendu (adapter le sélecteur si besoin)
    await page.waitForSelector('.cv-preview-root, .cv-preview, .finance-cv-template, .cv-main', { timeout: 15000 });
    // Screenshot A4 (794x1123px)
    const clip = { x: 0, y: 0, width: 794, height: 1123 };
    const filePath = path.join(EXPORT_DIR, `${id}.png`);
    await page.screenshot({ path: filePath, clip, omitBackground: false });
    console.log('→ Image enregistrée:', filePath);
  }
  await browser.close();
  console.log('Export terminé. Les images sont dans:', EXPORT_DIR);
})(); 