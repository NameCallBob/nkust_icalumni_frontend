/**
 * 登入頁流程測試。
 *
 * 登入是全站唯一一條「壞掉就什麼都不能做」的路徑，也是各種本地防護
 * （嘗試次數、封鎖倒數、記住帳號）疊在一起的地方。這些狀態存在 localStorage、
 * 跨頁面存活，靠人工測很難把每個組合走過一遍。
 */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Axios from 'common/Axios';
import LoginPage from '../LoginPage';

jest.mock('common/Axios');
jest.mock('react-toastify', () => ({
  ToastContainer: () => null,
  toast: {
    success: jest.fn(), error: jest.fn(), warning: jest.fn(),
    warn: jest.fn(), info: jest.fn(),
  },
}));
// eslint-disable-next-line import/first
const { toast } = require('react-toastify');
// react-helmet 在 jsdom 下會對 document.head 做真實操作，與被測邏輯無關。
jest.mock('SEO', () => () => null);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

/** 建一個可控的 axios 替身。 */
const mockApi = ({ post = jest.fn().mockResolvedValue({ data: {} }) } = {}) => {
  const instance = { post, get: jest.fn().mockResolvedValue({ data: {} }) };
  Axios.mockReturnValue(instance);
  return instance;
};

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.useFakeTimers({ advanceTimers: true });
  mockApi();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('初次載入', () => {
  it('顯示 email 輸入欄位', () => {
    renderLoginPage();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('帶出先前勾選「記住我」所存的 email', () => {
    // 這個值存在 localStorage，是使用者每天都會遇到的路徑。
    window.localStorage.setItem('rememberedEmail', 'remembered@example.invalid');

    renderLoginPage();

    expect(screen.getByRole('textbox')).toHaveValue('remembered@example.invalid');
  });

  it('沒有記住的 email 時欄位為空', () => {
    renderLoginPage();
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});

describe('封鎖倒數', () => {
  it('距離上次失敗未滿封鎖時間時，維持封鎖狀態', () => {
    // 5 次失敗後封鎖 5 分鐘；這裡設成「1 分鐘前剛失敗滿 5 次」。
    const oneMinuteAgo = Math.floor(Date.now() / 1000) - 60;
    window.localStorage.setItem('lastAttemptTime', String(oneMinuteAgo));
    window.localStorage.setItem('loginAttempts', '5');

    renderLoginPage();

    // 封鎖期間 lastAttemptTime 不得被清掉，否則重新整理就能繞過封鎖。
    expect(window.localStorage.getItem('lastAttemptTime')).toBe(String(oneMinuteAgo));
  });

  it('超過封鎖時間後自動清除封鎖紀錄', () => {
    const tenMinutesAgo = Math.floor(Date.now() / 1000) - 600;
    window.localStorage.setItem('lastAttemptTime', String(tenMinutesAgo));
    window.localStorage.setItem('loginAttempts', '5');

    renderLoginPage();

    expect(window.localStorage.getItem('lastAttemptTime')).toBeNull();
    expect(window.localStorage.getItem('loginAttempts')).toBeNull();
  });
});

describe('登入流程', () => {
  /**
   * @testing-library/user-event 在本專案是 v13（沒有 v14 的 `setup()` API），
   * 且這頁用了假計時器，所以這裡直接用 fireEvent 驅動，避免版本差異造成的雜訊。
   */
  const fillAndSubmit = async ({ email, password }) => {
    fireEvent.change(screen.getByRole('textbox'), { target: { value: email } });

    // 這頁是兩段式登入：先送 email，再出現密碼欄位。
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    const passwordInput = await screen.findByDisplayValue('', { selector: 'input[type="password"]' });
    fireEvent.change(passwordInput, { target: { value: password } });

    const submitButtons = screen.getAllByRole('button');
    fireEvent.click(submitButtons[submitButtons.length - 1]);
  };

  it('登入失敗會累加本地嘗試次數', async () => {
    // 前端的封鎖是「後端節流之外的額外一層」，它完全依賴這個計數器；
    // 計數沒累加的話，前端封鎖等於不存在。
    mockApi({ post: jest.fn().mockRejectedValue({ response: { status: 400 } }) });

    renderLoginPage();
    await fillAndSubmit({ email: 'someone@example.invalid', password: 'wrong' });

    await waitFor(() => {
      expect(Number(window.localStorage.getItem('loginAttempts') || 0)).toBeGreaterThan(0);
    });
  });

  it('後端回 429 時依 Retry-After 設定冷卻，不重複累加封鎖', async () => {
    // 後端登入節流是 10 次/分；前端要能正確反映那個等待時間，
    // 否則使用者會一直重試、一直被擋，卻不知道要等多久。
    mockApi({
      post: jest.fn().mockRejectedValue({
        response: { status: 429, headers: { 'retry-after': '42' } },
      }),
    });

    renderLoginPage();
    await fillAndSubmit({ email: 'someone@example.invalid', password: 'whatever' });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('42'));
    });
    // 429 的分支會提前 return，不應該再累加本地計數。
    expect(window.localStorage.getItem('loginAttempts')).toBeNull();
  });

  it('登入成功會清掉先前的失敗紀錄', async () => {
    window.localStorage.setItem('loginAttempts', '3');
    mockApi({ post: jest.fn().mockResolvedValue({ data: { message: 'OK', is_super: false } }) });

    renderLoginPage();
    await fillAndSubmit({ email: 'someone@example.invalid', password: 'correct' });

    await waitFor(() => {
      expect(window.localStorage.getItem('loginAttempts')).toBeNull();
    });
  });
});

describe('憑證處理（HttpOnly cookie 契約）', () => {
  it('登入成功後不把任何 token 存進 localStorage，只存顯示用資訊', async () => {
    // 後端 SEC-015：登入回應只有 { message, is_super }，token 在 HttpOnly Set-Cookie。
    mockApi({ post: jest.fn().mockResolvedValue({ data: { message: 'OK', is_super: true } }) });
    window.localStorage.setItem('jwt', 'None'); // 舊版殘留

    renderLoginPage();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'someone@example.invalid' },
    });
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);

    const passwordInput = await screen.findByDisplayValue('', {
      selector: 'input[type="password"]',
    });
    fireEvent.change(passwordInput, { target: { value: 'correct-password' } });
    const submitButtons = screen.getAllByRole('button');
    fireEvent.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() => {
      expect(window.localStorage.getItem('super')).toBe('true');
    });
    expect(window.localStorage.getItem('jwt')).toBeNull();
    expect(Number(window.localStorage.getItem('expiry'))).toBeGreaterThan(Date.now() / 1000);
  });

  it('載入時以 GET /basic/whoami 判斷登入狀態，而不是 token/verify', async () => {
    const api = mockApi();
    renderLoginPage();
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/basic/whoami'));
    expect(api.post).not.toHaveBeenCalledWith('api/token/verify/', expect.anything());
  });

  it('whoami 回 401 時清掉本地殘留的登入資訊且不跳轉', async () => {
    const api = mockApi();
    api.get.mockRejectedValue({ response: { status: 401 } });
    window.localStorage.setItem('expiry', '1');
    window.localStorage.setItem('super', 'true');

    renderLoginPage();

    await waitFor(() => expect(window.localStorage.getItem('expiry')).toBeNull());
    expect(window.localStorage.getItem('super')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
