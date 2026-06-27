# 前端整站遷移計劃 — Bootstrap → Tailwind v3 + DaisyUI v4

> 決策（已鎖定）：**一次性整站全面棄用 Bootstrap、MUI、PrimeReact**，改用 Tailwind CSS v3 + DaisyUI v4。
> 註：經掃描 **MUI / PrimeReact / primeflex 在 src 內 0 處引用（死依賴）** → 移除僅需 `npm uninstall`，不需重寫程式碼。
>
> ⚠️ **前置阻斷**：本機目前**未安裝 Node**（僅有 Homebrew）。需先 `brew install node && npm ci` 才能 build / 跑 react-snap / 跑 e2e。
> 在 Node 就緒前，無法驗證任何改動 → 採「**workflow 機械轉換 + 每關卡 build/test 驗證閘門**」模型，確保零技術債。
> 視覺目標：深藍主色（`#1e3a8a`）、人工智慧專業形象、高級質感；Modal 重設計為本案旗艦交付。
> 規模：84 個檔案 import react-bootstrap、約 4,500+ 處 class/元件。

---

## 1. 規模實況（遷移前必讀）

| 指標 | 數量 |
|---|---|
| import `react-bootstrap` 檔案 | 84 |
| `<Form>` / `<Button>` / `<Modal>` | 538 / 257 / 204 |
| `<Card>` / `<Col>` / `<Row>` / `<Container>` | 168 / 146 / 94 / 63 |
| `<Alert>` / `<Spinner>` / `<InputGroup>` / `<Badge>` | 63 / 49 / 49 / 46 |
| `<Pagination>` / `<Dropdown>` / `<Carousel>` / `<Tab>` | 77 / 32 / 32 / 22 |
| Bootstrap spacing class（mb-/mt-/px-…） | 1,609 |
| text-/bg-/fw- class | 1,016 |
| grid（col-/row/container） | 321 |
| d-flex / d-* | 289 |

**待移除套件**：`bootstrap`、`react-bootstrap`、`react-bootstrap-icons`、`react-bootstrap-carousel`、`bootstrap-icons`、`@mui/material`、`@mui/icons-material`、`primereact`、`primeflex`、`primeicons`。
（其中 MUI / PrimeReact / primeflex / primeicons 在 src 內 **0 處引用**，直接 uninstall 即可，無程式碼成本。）
**保留**：`framer-motion`、`swiper`、`react-quill`、`lucide-react`、`react-icons`、`@react-pdf-viewer/*`、`react-paginate`。

---

## 2. 目標技術棧與建置調整

### 2.1 建置工具（關鍵）
CRA `react-scripts 5.0.1` 不讀自訂 PostCSS 設定，必須引入 **CRACO**：
- 新增 `@craco/craco`，`package.json` scripts 由 `react-scripts` 改為 `craco`。
- 新增 `craco.config.js`、`tailwind.config.js`、`postcss.config.js`。

### 2.2 套件版本
```
tailwindcss@^3.4      postcss@^8      autoprefixer@^10
daisyui@^4            @craco/craco@^7
```

### 2.3 Tailwind 設定要點（避免撞爛 MUI/PrimeReact）
```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  corePlugins: { preflight: true },   // 全面遷移：Bootstrap 移除後可開 preflight
  theme: { extend: { /* 對應 variables.css 的 token */ } },
  plugins: [require('daisyui')],
  daisyui: { themes: [ /* 自訂深藍 theme，見 §3 */ ], logs: false },
}
```
> 註：MUI / PrimeReact 以各自 CSS-in-JS / scoped CSS 運作，受 preflight 影響小，但**遷移期間需在整合測試重點回歸這兩者的元件**（按鈕、表格、PDF viewer、日期元件）。

### 2.4 全域 CSS 切換
- `src/index.js:9` 的 `import 'bootstrap/dist/css/bootstrap.min.css'` → 移除。
- 新增 `src/index.css` 引入 `@tailwind base; @tailwind components; @tailwind utilities;`。
- 保留現有 `src/css/core/*`（variables/theme/typography）作為 DaisyUI theme 的事實來源。

---

## 3. 設計系統 — 深藍 DaisyUI 自訂主題

把現有 `variables.css` 的深藍體系映射成 DaisyUI theme，達成「AI 專業 + 高級」：

```js
daisyui: {
  themes: [{
    nkust: {
      "primary": "#1e3a8a",            // 深藍 - 學術權威
      "primary-content": "#ffffff",
      "secondary": "#a0781c",          // 沉穩金 - 榮譽點綴
      "secondary-content": "#ffffff",
      "accent": "#0f766e",             // 深綠 - 專業穩重
      "neutral": "#0f172a",            // near-black navy
      "base-100": "#ffffff",
      "base-200": "#f8fafc",
      "base-300": "#e2e8f0",
      "base-content": "#0f172a",
      "info": "#0284c7", "success": "#059669",
      "warning": "#d97706", "error": "#dc2626",
      "--rounded-box": "1rem",         // 高級圓角
      "--rounded-btn": "0.5rem",
      "--animation-btn": "0.25s",
    }
  }],
}
```
在 `<html data-theme="nkust">` 啟用。字體沿用 `--font-primary`（Noto Serif/Sans TC）。

### Modal 視覺規範（旗艦交付）
- Header：深藍漸層 `#1e3a8a → #0f172a` + 1px inset 頂部高光 + 圖示 + 金色細線。
- Backdrop：深藍調半透明 + `backdrop-blur`。
- 進場：framer-motion `scale .96→1 + fade + 上浮`。
- 尺寸：`sm 420 / md 640 / lg 880`；< 640px 轉全螢幕底部 sheet（DaisyUI `modal-bottom sm:modal-middle`）。
- 金色僅用於 active step / 重點數據，克制使用。

---

## 4. react-bootstrap → DaisyUI/Tailwind 等價對照表

| react-bootstrap | 取代方案 |
|---|---|
| `<Modal>` | DaisyUI `dialog.modal` + `AppModal` 共用元件 |
| `<Button variant>` | `btn btn-primary / btn-outline / btn-ghost` |
| `<Form.Control>` | `input input-bordered` / `textarea` / `select` |
| `<Form.Label/Group>` | `label` + `form-control` |
| `<Card>` | `card card-bordered` |
| `<Row>/<Col>` | Tailwind `grid grid-cols-12 gap-*` / flex |
| `<Container>` | `container mx-auto px-*` |
| `<Alert variant>` | `alert alert-info/success/warning/error` |
| `<Spinner>` | `loading loading-spinner` |
| `<Badge>` | `badge badge-*` |
| `<Dropdown>` | `dropdown` |
| `<Tabs/Tab>` | `tabs tabs-bordered` |
| `<Pagination>` | `join` + `btn`（或保留 `react-paginate`） |
| `<Carousel>` | 改用既有 `swiper`（已在依賴） |
| `<ProgressBar>` | `progress progress-primary` |
| `<Accordion>` | `collapse collapse-arrow` |
| Bootstrap icons | 改用 `lucide-react` / `react-icons`（已在依賴） |
| `mb-3/d-flex/text-center` 等工具 class | Tailwind 對應工具類 |

---

## 5. 執行計劃（一次性遷移的內部排序）

> 「一次性」指在**單一遷移分支**上完成，最終一起上線；內部仍需依相依性排序，每步驟可獨立測試。

### P0 — 建置與設計地基（2–3 天）
1. 安裝 Tailwind/DaisyUI/CRACO，建 4 個設定檔。
2. 建立 `nkust` 深藍 DaisyUI theme（§3）。
3. 切換全域 CSS：移除 Bootstrap import、加 Tailwind 入口。
4. 建 `src/components/common/AppModal.js` 旗艦 Modal 元件 + framer-motion + demo 驗證。
5. 建共用 UI 原子：`Button`、`Input`、`Card`、`Alert`、`Spinner` wrapper（封裝 DaisyUI class，降低逐檔改寫成本）。
- **驗收**：app 可啟動、theme 生效、AppModal demo 正常、MUI/PrimeReact 元件未壞。

### P1 — Modal 全面改寫（旗艦，5–7 天）
- 35 個 Modal 檔（§7 清單）全換成 `AppModal`，套深藍 header 規範。
- 多步驟表單（`EditModal` 1052 行、`recruitModal`、`recruitModalForAll`、`NewUserModal`）改用 AppModal 內建步驟條。
- **不動商業邏輯**（state/API/驗證）。
- **驗收**：每個 Modal 開關、表單提交、驗證、上傳、PDF/圖片預覽全數回歸通過。

### P2 — 共用框架元件（3–4 天）
- `Navbar`、`Footer`、`Pagination`、`Dropdown`、`Tabs`、`Card`、`Alert` 等跨頁元件改寫。
- 版面系統 `Row/Col/Container` → Tailwind grid/flex。

### P3 — 頁面逐區遷移（8–12 天，分模組）
- **前台 User**：Home、Alumni、AlumniList、Search、Intro 系列、Recruit、Activity、Login、Forgot。
- **後台 Manager**：User/Activity/Article/Alumni/Product/Pic/Recruit/Other 管理頁。
- 每模組：替換 react-bootstrap 元件 + 工具 class，逐頁視覺與功能回歸。

### P4 — 移除 Bootstrap 與收尾（2–3 天）
1. 全域搜尋確認 `react-bootstrap`、`bootstrap` import、`col-/row/d-flex/mb-` 等用量歸零。
2. `npm uninstall bootstrap react-bootstrap react-bootstrap-icons react-bootstrap-carousel bootstrap-icons primeflex`。
3. 移除死碼 CSS（`private_modal.css` 等）。
4. 全站視覺走查 + a11y（對比 ≥4.5:1、focus、ESC、焦點鎖定）+ RWD 稽核。
5. 跑 `e2e/` 全套 + `build` 驗證。

---

## 6. 風險登記簿

| 風險 | 影響 | 緩解 |
|---|---|---|
| Tailwind preflight 與 MUI/PrimeReact 衝突 | 元件樣式跑掉 | P0 即建立 MUI/Prime 回歸清單，必要時 scope preflight |
| DaisyUI 與 Bootstrap 暫時並存撞名 | 過渡期樣式亂 | 一次性遷移採單分支，盡量縮短並存期；或暫加 `dz-` 前綴 |
| CRA→CRACO build 問題（react-snap 預渲染） | build/SEO 壞 | P0 先驗證 `build` + `postbuild`(react-snap) |
| 538 個 Form / 大型多步驟表單回歸風險 | 功能退步 | 邏輯與樣式分 commit；逐檔對照測試 |
| 工期長、期間難上線 | 業務中斷 | 全程在 feature 分支；完成才合併上線 |

---

## 7. Modal 檔案清單（P1 範圍，35 檔）
```
components/Manage/Center/{EditModal,PwdUpdateModal,introModal}.js
components/Manage/Info/InfoPicModal.js
components/Manage/Other/{IndustryMana,PositionMana}.js
components/Manage/OutstandingAlumniMana/{OutstandingAlumniModal,EditOutstandingAlumniModal}.js
components/Manage/OutstandingMana/{OutstandingModal,EditOutstandingModal}.js
components/Manage/PicManage/PhotoUploadModal.js
components/Manage/Product/{Category,ProductDetail,ProductForm}.js
components/Manage/ProductManage/ProductFormModal.js
components/Manage/UserManage/{NewUserModal,AccountModal,PasswordUpdateModal,MemberExcelModal,UserTable}.js
components/Manage/WebPic/{Popup,SlideManager}.js
components/Manage/{recruitModal,recruitModalForAll}.js
components/User/Home/{PosterModal,CompanyTabs,Slide}.js
components/User/intro/Productlist.js
pages/Manager/{AllRecruitManaPage,RecruitManaPage}.js
pages/Manager/Alumni/{InfoManaPage,RuleManaPage}.js
pages/Manager/Article/ArticleFormPage.js
pages/User/{ActivityPage,RecruitPage}.js
```

---

## 8. 完成定義（Definition of Done）
- [ ] `grep -r react-bootstrap src/` 結果為 0
- [ ] `grep` Bootstrap 工具 class（col-/row/d-flex/mb-…）結果為 0
- [ ] `bootstrap` 系列套件已 uninstall
- [ ] 全站套用 `nkust` 深藍 theme，Modal 達成 §3 視覺規範
- [ ] `e2e/` 全綠、`npm run build` + react-snap 成功
- [ ] MUI / PrimeReact 元件無回歸
- [ ] a11y 與 RWD 稽核通過

---

## 9. 里程碑
- [ ] P0 地基（建置 + theme + AppModal + 原子元件）
- [ ] P1 Modal 全面改寫（旗艦）
- [ ] P2 共用框架元件
- [ ] P3 前台 + 後台頁面遷移
- [ ] P4 移除 Bootstrap + 稽核上線
