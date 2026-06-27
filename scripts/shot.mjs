// 截圖診斷工具：對 dev server 的指定路由，以三種裝置寬度截圖
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '_shots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = process.env.SHOT_BASE || 'http://localhost:3100';
const routes = (process.env.SHOT_ROUTES || '/').split(',');
const DEVICES = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
for (const route of routes) {
  for (const d of DEVICES) {
    const page = await browser.newPage();
    await page.setViewport({ width: d.width, height: d.height });
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      // 等 PageLoader 淡出消失，避免拍到載入 splash
      await page.waitForFunction(() => !document.querySelector('.page-loader'), { timeout: 8000 }).catch(() => {});
      await sleep(1500);
    } catch (e) {
      console.log(`⚠️ ${route} ${d.name}: ${String(e).slice(0, 80)}`);
    }
    const safe = route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
    const file = path.join(OUT, `${safe}__${d.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✅ ${file}`);
    await page.close();
  }
}
await browser.close();
