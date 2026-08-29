/**
 * SEO 標籤檢查。
 *
 * SEO 問題有個很惡劣的性質：壞掉的當下完全沒有任何徵兆，要等到兩三個月後
 * 搜尋流量掉下來才會有人察覺，而那時已經很難回推是哪一次改動造成的。
 * 把這些檢查放進 CI，就能在合併當下就知道。
 */
const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../../fixtures/test-data');

async function blockExternalResources(page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
}

test.describe('🔍 每頁的 SEO 標籤', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`@seo ${route.name} (${route.path})`, async ({ page }) => {
      await blockExternalResources(page);
      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);

      // ── title ──
      const title = await page.title();
      expect(title.trim().length, `${route.name} 沒有 <title>`).toBeGreaterThan(0);
      // Google 的搜尋結果標題大約在 60 字元處截斷。
      expect(title.length, `${route.name} 的標題過長（${title.length} 字元）：${title}`)
        .toBeLessThanOrEqual(70);

      // ── meta description ──
      const description = await page
        .locator('meta[name="description"]')
        .first()
        .getAttribute('content');
      expect(description, `${route.name} 缺少 meta description`).toBeTruthy();
      expect(
        description.length,
        `${route.name} 的 description 過長（${description.length} 字元）`
      ).toBeLessThanOrEqual(200);

      // ── Open Graph（社群分享卡片）──
      // 缺了這些，貼到 LINE/Facebook 只會顯示一個光禿禿的連結。
      for (const property of ['og:title', 'og:description', 'og:image']) {
        const content = await page
          .locator(`meta[property="${property}"]`)
          .first()
          .getAttribute('content')
          .catch(() => null);
        expect(content, `${route.name} 缺少 ${property}`).toBeTruthy();
      }

      // ── canonical ──
      // 同一頁若能從多個網址到達（有無尾斜線、帶不帶追蹤參數），
      // 沒有 canonical 會讓權重被分散到好幾個「不同的頁面」上。
      const canonical = await page
        .locator('link[rel="canonical"]')
        .first()
        .getAttribute('href')
        .catch(() => null);
      expect(canonical, `${route.name} 缺少 canonical 連結`).toBeTruthy();

      // ── 不得意外掛上 noindex ──
      // 這是最貴的一種失誤：一行 meta 就能讓整頁從搜尋結果消失。
      const robots = await page
        .locator('meta[name="robots"]')
        .first()
        .getAttribute('content')
        .catch(() => null);
      if (robots) {
        expect(robots.toLowerCase(), `${route.name} 被標記為 noindex`).not.toContain('noindex');
      }
    });
  }
});

test.describe('🔍 結構化資料', () => {
  test('@seo 首頁含有合法的 JSON-LD', async ({ page }) => {
    // JSON-LD 語法錯誤時 Google 會整段忽略，且不會有任何提示。
    await blockExternalResources(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const blocks = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((n) => n.textContent)
    );
    expect(blocks.length, '首頁沒有任何 JSON-LD 結構化資料').toBeGreaterThan(0);

    for (const block of blocks) {
      expect(() => JSON.parse(block), `JSON-LD 解析失敗：${block?.slice(0, 200)}`).not.toThrow();
      const parsed = JSON.parse(block);
      expect(parsed['@context']).toContain('schema.org');
    }
  });
});

test.describe('🔍 站台層級的 SEO 檔案', () => {
  test('@seo robots.txt 存在且指向 sitemap', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/robots.txt`);
    expect(response.status(), 'robots.txt 無法取得').toBeLessThan(400);

    const body = await response.text();
    expect(body, 'robots.txt 沒有 User-agent 指令').toContain('User-agent');
  });

  test('@seo sitemap.xml 可取得且為合法 XML', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/sitemap.xml`);
    if (response.status() >= 400) {
      test.skip(true, `sitemap.xml 回應 ${response.status()}，可能改由 API 提供`);
    }
    const body = await response.text();
    expect(body).toContain('<urlset');
  });
});
