/**
 * test-data.js
 * 集中管理測試資料，避免散落在各測試檔案
 */

const BASE_URL = process.env.BASE_URL || 'https://aaic.nkust.edu.tw';
const API_URL = process.env.API_URL || 'https://nkust-alumni-api.binbinbob.work';

// ── 公開路由（不需登入）──
const PUBLIC_ROUTES = [
  { path: '/', name: '首頁', titleKeyword: 'NKUST' },
  { path: '/login', name: '登入頁', titleKeyword: '登入' },
  { path: '/search', name: '企業搜尋', titleKeyword: '搜尋' },
  { path: '/alumnilist', name: '校友列表', titleKeyword: '校友' },
  { path: '/recruit', name: '招聘資訊', titleKeyword: '招聘' },
  { path: '/forgot', name: '忘記密碼', titleKeyword: '忘記密碼' },
  { path: '/IC/intro', name: '系友會簡介', titleKeyword: '簡介' },
  { path: '/IC/structure', name: '系友會組織', titleKeyword: '組織' },
  { path: '/IC/joinUs', name: '加入系友會', titleKeyword: '加入' },
  { path: '/IC/constitution', name: '系友會章程', titleKeyword: '章程' },
  { path: '/IC/contactUs', name: '聯絡我們', titleKeyword: '聯絡' },
  { path: '/website/terms/', name: '服務條款', titleKeyword: '條款' },
  { path: '/smart-business-department', name: '智慧商務系', titleKeyword: '智慧商務' },
  { path: '/ic-department', name: '智商系', titleKeyword: 'IC' },
  { path: '/nkust-ic', name: 'NKUST智慧商務', titleKeyword: 'NKUST' },
  { path: '/about-department', name: '系所介紹', titleKeyword: '系所' },
  { path: '/career-prospects', name: '就業前景', titleKeyword: '就業' },
];

// ── 管理頁路由（需登入）──
const MANAGER_ROUTES = [
  { path: '/alumni/manage/', name: '管理中心', contains: ['管理'] },
  { path: '/alumni/manage/member/', name: '會員管理', contains: ['會員'] },
  { path: '/alumni/manage/company/', name: '公司管理', contains: ['公司'] },
  { path: '/alumni/manage/recruit/', name: '招聘管理', contains: ['招聘'] },
  { path: '/alumni/manage/product/', name: '產品管理', contains: ['產品'] },
  { path: '/alumni/manage/pic/', name: '照片管理', contains: ['照片'] },
  { path: '/alumni/manage/website/', name: '網站管理', contains: ['網站'] },
  { path: '/alumni/manage/article/', name: '文章管理', contains: ['文章'] },
  { path: '/alumni/manage/info/', name: '系友會資料', contains: [] },
  { path: '/alumni/manage/constitutions/', name: '章程管理', contains: [] },
  { path: '/alumni/manage/outstanding/', name: '傑出系友', contains: [] },
  { path: '/alumni/manage/outstanding-alumni/', name: '傑出校友', contains: [] },
  { path: '/alumni/manage/recruit/all/', name: '全部招聘', contains: [] },
];

// ── API Mock 回應樣板 ──
const MOCK_RESPONSES = {
  loginSuccess: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature',
    is_super: false,
  },
  loginFailure: { detail: 'No active account found with the given credentials' },
  tokenVerify: { token: 'valid' },
  memberList: {
    count: 3,
    results: [
      { id: 1, name: '測試會員一', email: 'member1@test.com', is_active: true },
      { id: 2, name: '測試會員二', email: 'member2@test.com', is_active: false },
      { id: 3, name: '測試會員三', email: 'member3@test.com', is_active: true },
    ],
  },
  emptyList: { count: 0, results: [] },
  searchResults: {
    count: 2,
    results: [
      { id: 1, name: '測試公司A', industry: '科技' },
      { id: 2, name: '測試公司B', industry: '製造' },
    ],
  },
};

// ── 測試帳號 ──
const TEST_CREDENTIALS = {
  valid: {
    email: process.env.TEST_EMAIL || 'c110156220@nkust.edu.tw',
    password: process.env.TEST_PASSWORD || '***REMOVED-CREDENTIAL***',
  },
  invalid: {
    email: 'notexist@fake.com',
    password: 'wrongpassword',
  },
  invalidFormat: {
    email: 'not-an-email',
    password: '',
  },
};

module.exports = {
  BASE_URL,
  API_URL,
  PUBLIC_ROUTES,
  MANAGER_ROUTES,
  MOCK_RESPONSES,
  TEST_CREDENTIALS,
};
