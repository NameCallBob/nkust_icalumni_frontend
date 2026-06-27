// 後台真實截圖：用真實 admin JWT 登入 + 連真實後端(8001)，截帶資料的後台頁面。
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '_shots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3100';
const TOKEN = process.env.JWT;
const SUPER = process.env.IS_SUPER || 'true';
const routes = (process.env.SHOT_ROUTES || '/alumni/manage/').split(',');
const DEVICES = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

for (const route of routes) {
  for (const d of DEVICES) {
    const page = await browser.newPage();
    await page.setViewport({ width: d.width, height: d.height });
    await page.evaluateOnNewDocument((tok, sup) => {
      localStorage.setItem('jwt', tok);
      localStorage.setItem('super', sup);
      localStorage.setItem('issuedAt', String(Math.floor(Date.now() / 1000)));
      localStorage.setItem('expiry', String(Math.floor(Date.now() / 1000) + 14400));
    }, TOKEN, SUPER);
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 35000 });
      await page.waitForFunction(() => !document.querySelector('.page-loader'), { timeout: 8000 }).catch(() => {});
      await sleep(3800); // 等資料載入
    } catch (e) {
      console.log(`⚠️ ${route} ${d.name}: ${String(e).slice(0, 80)}`);
    }
    const safe = route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root';
    const file = path.join(OUT, `auth_${safe}__${d.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✅ ${file}`);
    await page.close();
  }
}
await browser.close();
