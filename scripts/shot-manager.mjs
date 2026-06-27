// 後台截圖：注入假 JWT + 攔截 API（token 驗證放行、列表回空），
// 讓需登入的後台頁面渲染出版面外殼供視覺 QA（不依賴真實後端資料）。
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '_shots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3100';
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

    // 注入假登入狀態
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('jwt', 'dummy.qa.token');
      localStorage.setItem('super', 'true');
      localStorage.setItem('issuedAt', String(Math.floor(Date.now() / 1000)));
      localStorage.setItem('expiry', String(Math.floor(Date.now() / 1000) + 99999));
    });

    // 攔截 API：token 驗證放行、其餘回空集合，避免 401 導回登入
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('localhost:8001') || url.includes('/api/') || url.includes('nkust-alumni-api')) {
        const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' };
        if (req.method() === 'OPTIONS') return req.respond({ status: 200, headers, body: '' });
        let body = '{"results":[],"count":0,"data":[]}';
        if (url.includes('token/verify')) body = '{"ok":true}';
        return req.respond({ status: 200, headers, body });
      }
      req.continue();
    });

    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForFunction(() => !document.querySelector('.page-loader'), { timeout: 8000 }).catch(() => {});
      await sleep(1500);
    } catch (e) {
      console.log(`⚠️ ${route} ${d.name}: ${String(e).slice(0, 80)}`);
    }
    const safe = route.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'root';
    const file = path.join(OUT, `mgr_${safe}__${d.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✅ ${file}`);
    await page.close();
  }
}
await browser.close();
