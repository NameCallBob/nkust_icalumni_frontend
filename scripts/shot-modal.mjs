// 開啟並截圖 Modal：導到指定後台頁，點擊含指定文字的按鈕開 Modal，截桌機+手機。
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, '..', '_shots');
fs.mkdirSync(OUT, { recursive: true });

const BASE = 'http://localhost:3100';
const TOKEN = process.env.JWT;
const ROUTE = process.env.ROUTE || '/alumni/manage/member/';
const BTN_TEXT = process.env.BTN || '添加完整帳號';
const NAME = process.env.NAME || 'modal';
const DEVICES = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
for (const d of DEVICES) {
  const page = await browser.newPage();
  await page.setViewport({ width: d.width, height: d.height });
  await page.evaluateOnNewDocument((tok) => {
    localStorage.setItem('jwt', tok);
    localStorage.setItem('super', 'true');
    localStorage.setItem('expiry', String(Math.floor(Date.now() / 1000) + 14400));
  }, TOKEN);
  try {
    await page.goto(`${BASE}${ROUTE}`, { waitUntil: 'networkidle2', timeout: 35000 });
    await page.waitForFunction(() => !document.querySelector('.page-loader'), { timeout: 8000 }).catch(() => {});
    await sleep(2500);
    // 點擊含指定文字的按鈕
    const clicked = await page.evaluate((txt) => {
      const els = [...document.querySelectorAll('button, a, [role=button]')];
      const el = els.find((e) => (e.textContent || '').includes(txt));
      if (el) { el.click(); return true; }
      return false;
    }, BTN_TEXT);
    await sleep(1800);
    if (!clicked) console.log(`⚠️ ${d.name}: 找不到按鈕「${BTN_TEXT}」`);
  } catch (e) {
    console.log(`⚠️ ${d.name}: ${String(e).slice(0, 80)}`);
  }
  const file = path.join(OUT, `modal_${NAME}__${d.name}.png`);
  await page.screenshot({ path: file, fullPage: false }); // 視窗範圍即可（Modal 在視窗內）
  console.log(`✅ ${file}`);
  await page.close();
}
await browser.close();
