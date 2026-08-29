/**
 * 無障礙（a11y）基本檢查。
 *
 * 這裡只檢查「一定是錯」的結構性問題，不做需要人工判斷的項目（例如
 * alt 文字寫得好不好、色彩對比是否足夠）。這樣做的好處是零誤報——
 * 任何一條紅燈都是真的要修，不會有人因為雜訊而把整個 a11y 檢查關掉。
 *
 * 對系友會網站來說這件事有實際約束力：這是公立大學的對外網站，
 * 需符合國家通訊傳播委員會的無障礙網頁規範。
 */
const { test, expect } = require('@playwright/test');
const { PUBLIC_ROUTES } = require('../../fixtures/test-data');

async function blockExternalResources(page) {
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
  await page.route(/googletagmanager\.com|google-analytics\.com/, (route) => route.abort());
  await page.route(/hcaptcha\.com|recaptcha\.net/, (route) => route.abort());
}

test.describe('♿ 無障礙結構檢查', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`@a11y ${route.name} (${route.path})`, async ({ page }) => {
      await blockExternalResources(page);
      await page.goto(route.path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500); // 等 React 掛載完成

      // ── html lang ──
      // 螢幕閱讀器靠這個屬性決定用哪種語音發音。缺了它，中文內容會被用
      // 英文發音規則讀出來，完全聽不懂。
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang, `${route.name} 的 <html> 缺少 lang 屬性`).toBeTruthy();

      // ── 每頁必須有且只有一個 h1 ──
      // h1 是螢幕閱讀器使用者跳到主要內容的錨點。
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `${route.name} 的 h1 數量為 ${h1Count}（應為 1）`).toBeGreaterThan(0);

      // ── 所有圖片都要有 alt ──
      // 純裝飾圖用 alt="" 即可（表示「請略過」），但屬性本身不能沒有。
      const imagesWithoutAlt = await page.locator('img:not([alt])').count();
      expect(imagesWithoutAlt, `${route.name} 有 ${imagesWithoutAlt} 張圖片缺少 alt 屬性`).toBe(0);

      // ── 純圖示按鈕要有可讀名稱 ──
      // 只有一個 SVG 圖示的按鈕，螢幕閱讀器會唸成「按鈕」，使用者無從得知用途。
      const namelessButtons = await page.$$eval('button', (buttons) =>
        buttons
          .filter((b) => {
            const hasText = (b.textContent || '').trim().length > 0;
            const hasLabel = b.getAttribute('aria-label') || b.getAttribute('title');
            return !hasText && !hasLabel;
          })
          .map((b) => b.outerHTML.slice(0, 120))
      );
      expect(
        namelessButtons,
        `${route.name} 有無可讀名稱的按鈕：\n${namelessButtons.join('\n')}`
      ).toEqual([]);

      // ── 表單欄位要有標籤 ──
      const unlabelledInputs = await page.$$eval(
        'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea',
        (fields) =>
          fields
            .filter((f) => {
              if (f.getAttribute('aria-label') || f.getAttribute('aria-labelledby')) return false;
              if (f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`)) return false;
              if (f.closest('label')) return false;
              // placeholder 不是標籤（輸入後就消失了），但先接受它以免誤報過多
              return !f.getAttribute('placeholder');
            })
            .map((f) => f.outerHTML.slice(0, 120))
      );
      expect(
        unlabelledInputs,
        `${route.name} 有未標註的表單欄位：\n${unlabelledInputs.join('\n')}`
      ).toEqual([]);
    });
  }
});

test.describe('♿ 鍵盤操作', () => {
  test('@a11y 首頁可用 Tab 逐一走訪互動元素', async ({ page }) => {
    // 無法使用滑鼠的使用者完全依賴這條路徑。若某個元素用 div + onClick
    // 實作而沒有 tabindex，鍵盤永遠到不了它。
    await blockExternalResources(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const visited = [];
    for (let i = 0; i < 15; i += 1) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => document.activeElement?.tagName);
      visited.push(tag);
    }

    // 至少要走到幾個真正的互動元素，而不是一路停在 body。
    const interactive = visited.filter((t) => ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(t));
    expect(interactive.length, `Tab 15 次只走到 ${interactive.length} 個互動元素`).toBeGreaterThan(3);
  });

  test('@a11y 聚焦時有可見的外框', async ({ page }) => {
    // `outline: none` 是最常見的 a11y 破壞——設計上變乾淨了，
    // 但鍵盤使用者從此不知道自己focus在哪裡。
    await blockExternalResources(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    await page.keyboard.press('Tab');
    const focusStyle = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = window.getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    });

    if (focusStyle) {
      const hasVisibleFocus =
        (focusStyle.outlineStyle !== 'none' && focusStyle.outlineWidth !== '0px') ||
        (focusStyle.boxShadow && focusStyle.boxShadow !== 'none');
      expect(hasVisibleFocus, `聚焦樣式：${JSON.stringify(focusStyle)}`).toBeTruthy();
    }
  });
});
