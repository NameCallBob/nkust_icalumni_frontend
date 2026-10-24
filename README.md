# nkust_icalumni 前端

國立高雄科技大學智慧商務系系友會網站。React 18 + Vite + Tailwind CSS（DaisyUI / shadcn 風格元件）。

## 環境需求

- Node.js >= 20.19（或 >= 22.12；Vite 8 的需求）
- 後端 API：`IC_alumni`（本機預設 `http://127.0.0.1:8000`）

## 開始

```bash
npm ci
cp .env.example .env     # 填入 VITE_BASE_URL
npm start                # 開發伺服器 http://localhost:3000（= vite）
```

開發伺服器固定使用 **3000 埠**：後端的 CORS / CSRF 白名單只放行 `http://localhost:3000`，
換埠會讓登入 cookie 與 API 請求被擋。

## 指令

| 指令 | 說明 |
|---|---|
| `npm start` / `npm run dev` | 開發伺服器（Vite） |
| `npm run build` | 正式建置到 `build/`，並由 `postbuild` 執行 SEO 預渲染（`scripts/prerender.mjs`，需要 puppeteer 的 Chrome） |
| `npm run preview` | 以 3000 埠預覽 `build/` |
| `npm run test:ci` | 單元測試跑一次（Vitest + jsdom） |
| `npm test` | 單元測試 watch 模式 |
| `npm run test:coverage` | 含覆蓋率與門檻檢查 |
| `npm run lint` | ESLint（警告數棘輪，只能往下調） |
| `npm run e2e` / `npm run e2e:smoke` | Playwright E2E（會打正式站，見 `docs/TESTING.md`） |

## 環境變數

| 變數 | 說明 |
|---|---|
| `VITE_BASE_URL` | 後端 API 根網址。**由 CRA 時代的 `REACT_APP_BASE_URL` 更名**；部署環境若仍設舊名稱，需一併改掉，否則 API 會打到空網址 |

只有 `VITE_` 開頭的變數會進到瀏覽器程式碼；變數是在**建置時**寫死，改了要重新 build。

## 專案結構備忘

- `index.html` 在專案根目錄（Vite 的入口），`public/` 的檔案原樣複製到 `build/` 根目錄。
- 路徑別名：`@/xxx` 與 `common/Axios`、`components/...`、`assets/...` 這種「src 底下第一層」寫法皆可，
  設定在 `vite.config.mjs`（自動依 `src/` 第一層項目產生）與 `jsconfig.json`（給編輯器）。
- 含 JSX 的檔案副檔名為 `.jsx`（Vite 8 不會把 `.js` 當 JSX 編譯）。
- 認證：後端以 HttpOnly cookie 發 JWT，前端不保存 token；細節見 `docs/TESTING.md` 與 `src/common/Axios.js`。
- 測試與品質檢查說明：`docs/TESTING.md`。

## 部署

`build/` 為靜態檔，部署在網域根目錄（`base: '/'`）。伺服器需對未知路徑回 `index.html`（SPA fallback）；
預渲染產生的 `build/<route>/index.html` 供搜尋引擎抓取。
