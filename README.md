# 高雄科技大學 智慧商務系友會 — 前端網站

國立高雄科技大學智慧商務系系友會官方網站前端，提供系友資料查詢、企業/徵才媒合展示、活動與電子報瀏覽、系友會簡介，以及後台管理介面（會員/企業/活動/圖片/內容管理）。

- 正式環境：`https://aaic.nkust.edu.tw`
- 對應後端 API：[nkust_icalumni_backend](https://github.com/NameCallBob/nkust_icalumni_backend)（`https://nkust-alumni-api.binbinbob.work`）

## 技術棧

- **React 18** + **Create React App**（`react-scripts`）
- **React Router v6** — 前端路由
- **React Bootstrap** + **PrimeReact** / **PrimeIcons** / **PrimeFlex** — UI 元件
- **Axios** — API 溝通（`src/common/Axios.js`）
- **React Quill** — 後台富文本編輯（活動/章程等內容）
- **DOMPurify** — 富文本輸出端 XSS 淨化（見〈資安〉章節）
- **react-google-recaptcha** / **hCaptcha** — 表單機器人防護
- **react-pdf** / **pdf-viewer-reactjs** — 章程等 PDF 檢視
- **Framer Motion** — 動畫

## 專案結構

```
src/
├── pages/
│   ├── User/            # 對外網站頁面（首頁、系友查詢、徵才、活動、系友會簡介等）
│   └── Manager/          # 後台管理頁面（會員/企業/產品/徵才/活動/圖片/內容管理）
├── components/
│   ├── User/              # 前台共用元件
│   └── Manage/             # 後台共用元件
├── common/                # Axios 實例、共用工具
└── SEO/                    # 頁面 SEO meta 元件
```

> 專案目前有一條進行中的 UI 重構分支（`ui-rebuild-shadcn`，改用 shadcn/ui + Tailwind），本 README 描述的是 `main` 分支目前實際部署的版本。

## 本機開發

```bash
git clone https://github.com/NameCallBob/nkust_icalumni_frontend.git
cd nkust_icalumni_frontend
npm install
cp .env.example .env   # 設定 REACT_APP_BASE_URL 指向後端 API
npm start
```

`npm start` 會在 `http://localhost:3000` 啟動開發伺服器（後端 CORS 已允許此來源）。

### 環境變數

| 變數 | 說明 |
|---|---|
| `REACT_APP_BASE_URL` | 後端 API 的 base URL，例如本機開發用 `http://localhost:8001`，正式環境為 `https://nkust-alumni-api.binbinbob.work` |

### 建置

```bash
npm run build
```

## 資安

- 所有後台/前台以 `dangerouslySetInnerHTML` 呈現的後端來源內容（活動描述、系友會簡介、加入辦法、幹部介紹、章程、章程管理預覽等）皆先經過 `DOMPurify.sanitize()` 處理，避免後端富文本欄位（CKEditor）被用於儲存型 XSS。
- 登入/忘記密碼流程已配合後端節流與防帳號列舉機制調整（見 `LoginPage`、`ResetPassPage`、`func_forgot/`）。
- 401 由 Axios 攔截器統一處理並清除本機憑證。

## 授權

內部專案，非公開授權；如需開源授權條款請與系友會技術負責人確認後於此補充。
