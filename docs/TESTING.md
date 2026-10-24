# 測試指南（前端 nkust_icalumni）

測試分兩層，各自回答不同的問題：

| 層 | 工具 | 回答的問題 | 需要網路 |
|---|---|---|---|
| 單元／元件 | Jest + React Testing Library | 這段邏輯本身對不對？ | 否 |
| 端對端（E2E） | Playwright | 真實瀏覽器裡整條流程走得通嗎？ | 是（打正式站） |

---

## 快速開始

```bash
npm install

npm test              # 單元測試（watch 模式）
npm run test:ci       # 單元測試（跑一次就結束，CI 用）
npm run test:coverage # 含覆蓋率
npm run lint          # ESLint（棘輪模式，見下方）

npm run e2e           # 全部 E2E（會打正式站）
npm run e2e:smoke     # 只跑 smoke
```

E2E 需要先安裝瀏覽器：`npm --prefix e2e run install-browsers`。

---

## 單元測試

### 這一層會抓到什麼

| 你做的改動 | 會失敗的測試 |
|---|---|
| 改壞 SEO 標題／描述的產生邏輯 | `src/utils/__tests__/seoHelper.test.js` |
| 移除圖片載入失敗的無限迴圈防護 | `src/utils/__tests__/imageDefaults.test.js` |
| 動到 RWD 斷點 | `src/hooks/__tests__/useRWD.test.js` |
| 改壞 API 錯誤處理或憑證帶法 | `src/common/__tests__/Axios.test.js` |
| 動到登入流程的本地封鎖邏輯 | `src/pages/User/__tests__/LoginPage.test.js` |
| 忘記清除 setInterval | `src/components/__tests__/LoadingSpinner.test.js` |

### 測試不會碰外部世界

`src/setupTests.js` 做了三件事，新寫的測試自動受惠：

1. 補上 jsdom 缺少的瀏覽器 API（`matchMedia`、`IntersectionObserver`、
   `ResizeObserver`、`scrollTo`）——缺了它們，元件會以 `TypeError` 崩潰，
   測到的是「假的失敗」。
2. 讓 `fetch` 直接拋錯——單元測試不得打真實網路。需要網路互動的情境請 mock
   該模組，或移到 `e2e/`。
3. 每個測試後清空 `localStorage` / `sessionStorage` 與所有 mock——
   不清的話「登入狀態」會外洩到下一個測試，症狀是單獨跑會過、整批跑就掛。

### 覆蓋率門檻

門檻定義在 `package.json` 的 `jest.coverageThreshold`，**只針對已補上測試的
核心模組**（`seoHelper` / `imageDefaults` / `useRWD`），不對整個 `src` 設全域門檻。

理由：現有的大型頁面元件尚未補測試，設全域門檻只會逼人寫「render 一次然後
assert 沒爆炸」這種沒有價值的測試來衝數字。之後每替一個模組補上真正的測試，
就把它加進這份清單。

### ESLint 棘輪

`npm run lint` 目前是 `--max-warnings=67`，釘住既有的警告數量：

- **新增**警告 → CI 失敗
- 既有的 68 個不會擋住所有人

清掉幾個就把數字調低幾個。**這個數字只能往下走。**
想看完整清單：`npm run lint:strict`。

---

## E2E（Playwright）

`e2e/` 是獨立的 npm 專案，有自己的 `package.json` 與 `node_modules`。

### 測試分組

```bash
cd e2e

npm run test:smoke      # 全站頁面不白屏、無 JS 崩潰
npm run test:auth       # 登入／忘記密碼
npm run test:nav        # 導覽
npm run test:crud       # 管理端增刪改查（需登入）
npm run test:a11y       # 無障礙結構檢查
npm run test:seo        # SEO 標籤、結構化資料、robots/sitemap
npm run test:security   # 安全標頭、source map、憑證儲存位置
npm run test:quality    # 上面三組（a11y + seo + security）一次跑完
```

### 三組品質檢查在測什麼

**`tests/a11y/`**——只檢查「一定是錯」的結構性問題（缺 `lang`、缺 `h1`、
圖片沒有 `alt`、純圖示按鈕沒有可讀名稱、表單欄位沒有標籤、聚焦沒有外框）。
不做需要人工判斷的項目，因此零誤報——任何紅燈都是真的要修。
這是公立大學的對外網站，需符合無障礙網頁規範。

**`tests/seo/`**——每頁的 `title` 長度、`meta description`、Open Graph、
`canonical`、有沒有被意外標成 `noindex`，以及 JSON-LD 是否為合法 JSON。
SEO 壞掉時當下沒有任何徵兆，要等兩三個月後流量掉下來才會有人發現。

**`tests/security/`**——HTTP 安全標頭、正式站不得公開 source map、
`localStorage` 不得存放 JWT、登入 cookie 必須 `HttpOnly + Secure`、
後端的 Swagger/Redoc 不得對外開放。這些都是「上線後某次設定調整就可能
悄悄失效」的東西。

### 測試帳號

E2E 憑證由環境變數提供，**絕不寫死在檔案裡**：

```bash
E2E_EMAIL=... E2E_PASSWORD=... npm test
```

CI 中由 repository secrets 提供（`E2E_EMAIL` / `E2E_PASSWORD`）。

### E2E 打的是正式站

`playwright.config.js` 預設 `BASE_URL=https://aaic.nkust.edu.tw`。
因此 E2E **不會**在每次 PR 自動執行——只在 GitHub Actions 手動觸發
（`workflow_dispatch`，勾選 `run_e2e`）。

要打本地開發站：

```bash
BASE_URL=http://localhost:3000 API_URL=http://127.0.0.1:8000 npm test
```

---

## 🚨 已知問題（一）：`ui-rebuild-shadcn` 分支無法建置

`npm run build` 目前會失敗。原因是 UI 重構過程中，有 6 個檔案 import 了一組
**從未被提交進版控**的模組：

| 缺少的模組 | 被誰引用 |
|---|---|
| `@/components/ui` | `PhotoUploadModal`、`NewUserModal`、`RecruitManaPage`、`UserManagePage`、`AlumniListPage`、`RulePage` |
| `@/services` | `NewUserModal`、`RecruitManaPage`、`UserManagePage`、`RulePage` |
| `@/hooks/useMediaQuery` | `RecruitManaPage`、`RulePage` |
| `@/lib/utils` | `AlumniListPage` |
| `utils/validatePassword` | `NewUserModal` |

`git log --all --diff-filter=A` 查不到這些檔案曾經被加入過任何分支，
所以它們應該還躺在某個 worktree 或未提交的工作目錄裡。

`src/__tests__/module-resolution.test.js` 會在幾十毫秒內把完整清單印出來
（`npm run test:ci` 就看得到），比等一分鐘的 build 快得多。補齊檔案之後，
記得把 `KNOWN_MISSING_MODULES` 清空——那支測試會提醒你。

順帶一提，`@/` 這個別名本身也還沒設定：`jsconfig.json` 只有 `baseUrl: "src"`，
`craco.config.js` 也沒有 webpack alias。補檔案的同時要一併加上，例如：

```js
// craco.config.js
const path = require('path');
module.exports = {
  webpack: { alias: { '@': path.resolve(__dirname, 'src') } },
  // ...既有的 style 設定
};
```

---

## ⚠️ 已知問題（二）：前端與後端的認證機制不一致

見 `src/common/__tests__/auth-contract.test.js`。

後端在 SEC-015 把 JWT 從「回應 body 交付、前端存 localStorage」改成
「HttpOnly cookie + CSRF double-submit」，但前端尚未跟上：

| 項目 | 後端現況 | 前端現況 |
|---|---|---|
| token 交付 | 只透過 `Set-Cookie`（HttpOnly） | 讀 `res.data.token` 存 localStorage |
| 跨網域 cookie | 需要 `withCredentials: true` | 未設定 |
| 寫入請求 CSRF | 需要 `X-CSRFToken` 標頭 | 未送出 |
| 登入狀態判斷 | `GET /basic/whoami` | 讀 localStorage |

實際後果：登入回應沒有 `token` 欄位 → `localStorage.setItem('jwt', undefined)`
→ 存進字面上的字串 `"undefined"` → 後續請求送出 `Authorization: Bearer undefined`。

`auth-contract.test.js` 用一組 `it.skip` 列出了遷移的驗收條件；
遷移時把 `.skip` 拿掉，它們就變成「改對了沒有」的檢查清單。

---

## 加新測試

- 純函數／hook → `src/<模組>/__tests__/<名稱>.test.js`
- 元件行為 → 同上，用 React Testing Library 從**使用者看得到的東西**去查詢
  （`getByRole` / `getByText`），不要用 class name 或元件內部狀態
- 真實瀏覽器才驗得到的（安全標頭、cookie 屬性、跨頁流程）→ `e2e/`

寫斷言訊息時說明**為什麼這件事重要**。半年後看到紅燈的人需要能直接從訊息
判斷嚴重性，而不是回頭考古。

`@testing-library/user-event` 在本專案是 **v13**（沒有 v14 的 `setup()` API）。
搭配假計時器時建議直接用 `fireEvent`，避免版本差異造成的雜訊。
