// 現代化 SEO 預渲染（取代 react-snap 內建過舊的 puppeteer@1.20）
// 用 puppeteer@25 + Chrome for Testing 驅動，逐路由擷取渲染後 HTML 寫回 build/<route>/index.html。
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.resolve(__dirname, '..', 'build');
const PORT = 45999;

// 與 package.json reactSnap.include 對齊
const ROUTES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['/', '/search', '/IC/intro', '/IC/structure', '/IC/joinUs', '/IC/contactUs',
     '/alumni', '/alumni-list', '/recruit', '/smart-business-department',
     '/ic-department', '/nkust-ic', '/about-department', '/career-prospects'];

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webm': 'video/webm' };

// 靜態伺服器 + SPA fallback（找不到實體檔就回 index.html，交給前端路由）
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(BUILD, urlPath);
  try {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      filePath = path.join(BUILD, 'index.html');
    }
  } catch {
    filePath = path.join(BUILD, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function run() {
  await new Promise((r) => server.listen(PORT, r));
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const results = [];
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    let ok = false, size = 0, rootChildren = 0;
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle2', timeout: 30000 });
      // 等待 React 把內容掛上 #root（API 失敗也至少有殼）
      await page.waitForFunction(
        () => document.querySelector('#root') && document.querySelector('#root').children.length > 0,
        { timeout: 12000 }
      ).catch(() => {});
      await sleep(400);
      rootChildren = await page.evaluate(() => document.querySelector('#root')?.children.length || 0);
      const html = '<!DOCTYPE html>' + (await page.evaluate(() => document.documentElement.outerHTML));
      const outDir = route === '/' ? BUILD : path.join(BUILD, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html);
      size = Buffer.byteLength(html);
      ok = rootChildren > 0;
    } catch (e) {
      results.push({ route, ok: false, error: String(e).slice(0, 120) });
      await page.close();
      continue;
    }
    results.push({ route, ok, rootChildren, size });
    await page.close();
  }
  await browser.close();
  server.close();
  const good = results.filter((r) => r.ok).length;
  console.log(JSON.stringify({ total: ROUTES.length, prerendered: good, results }, null, 2));
  process.exit(good === ROUTES.length ? 0 : 1);
}

run().catch((e) => { console.error(e); process.exit(1); });
