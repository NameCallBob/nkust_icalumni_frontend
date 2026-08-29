/**
 * Axios 客戶端工廠。
 *
 * 全站所有 API 呼叫都經過這裡，它決定了三件事：憑證怎麼帶、逾時多久、
 * 各種 HTTP 錯誤怎麼呈現給使用者。任何一項改壞，症狀都是「某些操作莫名其妙
 * 失敗但沒有錯誤訊息」——最難除錯的那種。
 */
import axios from 'axios';
import { toast } from 'react-toastify';
import Axios from '../Axios';

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

/** 取出實例上註冊的 response 攔截器（成功／失敗兩支）。 */
const interceptorsOf = (instance) => {
  const handler = instance.interceptors.response.handlers[0];
  return { onFulfilled: handler.fulfilled, onRejected: handler.rejected };
};

/** 執行失敗攔截器並回傳它拋出的錯誤（一定會 reject）。 */
const runRejected = async (instance, error) => {
  const { onRejected } = interceptorsOf(instance);
  await expect(onRejected(error)).rejects.toBe(error);
};

describe('實例設定', () => {
  it('逾時設為 10 秒', () => {
    // 沒有逾時的請求會讓使用者對著轉圈圈等到天荒地老。
    expect(Axios().defaults.timeout).toBe(10000);
  });

  it('送出 JSON', () => {
    expect(Axios().defaults.headers['Content-Type']).toBe('application/json');
  });

  it('每次呼叫都重新讀取憑證', () => {
    // 工廠函數而非單例的意義就在這裡：登入後不必重新整理頁面就能帶上新憑證。
    window.localStorage.setItem('jwt', 'first-token');
    expect(Axios().defaults.headers.Authorization).toBe('Bearer first-token');

    window.localStorage.setItem('jwt', 'second-token');
    expect(Axios().defaults.headers.Authorization).toBe('Bearer second-token');
  });

  it('沒有憑證時不得送出 "Bearer undefined" 或 "Bearer null"', () => {
    // 送出字面上的 "undefined" 會讓後端試圖解析它，錯誤訊息會變得很難懂。
    window.localStorage.removeItem('jwt');
    const auth = Axios().defaults.headers.Authorization;
    expect(auth).not.toContain('undefined');
    expect(auth).not.toContain('null');
  });
});

describe('成功回應攔截器', () => {
  it('原樣回傳回應物件', () => {
    const { onFulfilled } = interceptorsOf(Axios());
    const response = { status: 200, data: { ok: true } };
    expect(onFulfilled(response)).toBe(response);
  });

  it('201 顯示新增成功提示', () => {
    const { onFulfilled } = interceptorsOf(Axios());
    onFulfilled({ status: 201 });
    expect(toast.success).toHaveBeenCalled();
  });

  it('204 顯示操作完成提示', () => {
    const { onFulfilled } = interceptorsOf(Axios());
    onFulfilled({ status: 204 });
    expect(toast.success).toHaveBeenCalled();
  });

  it('200 不顯示任何提示（一般讀取不該一直跳通知）', () => {
    const { onFulfilled } = interceptorsOf(Axios());
    onFulfilled({ status: 200 });
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe('錯誤回應攔截器', () => {
  it('永遠 reject，讓呼叫端的 .catch 仍能收到錯誤', async () => {
    // 攔截器若吞掉錯誤，呼叫端的 catch 永遠不會執行，
    // 表單會停在「送出中」的狀態而使用者不知道發生什麼事。
    await runRejected(Axios(), { response: { status: 500 } });
  });

  it.each([
    [405, 'warning'],
    [406, 'warning'],
    [409, 'warning'],
    [413, 'warning'],
    [422, 'warning'],
    [429, 'info'],
    [500, 'error'],
    [502, 'error'],
    [503, 'info'],
    [504, 'error'],
  ])('%i 顯示 %s 等級的提示', async (status, level) => {
    await runRejected(Axios(), { response: { status } });
    expect(toast[level]).toHaveBeenCalled();
  });

  it('逾時（ECONNABORTED）有專屬提示', async () => {
    await runRejected(Axios(), { code: 'ECONNABORTED' });
    expect(toast.error).toHaveBeenCalled();
  });

  it('完全沒有回應（斷網）時提示網路問題', async () => {
    await runRejected(Axios(), { request: {} });
    expect(toast.error).toHaveBeenCalled();
  });

  it('請求被取消時顯示警告而非錯誤', async () => {
    const cancelError = new axios.Cancel('cancelled');
    const { onRejected } = interceptorsOf(Axios());
    await expect(onRejected(cancelError)).rejects.toBe(cancelError);
    expect(toast.warning).toHaveBeenCalled();
  });

  it('未知狀態碼不得崩潰', async () => {
    await runRejected(Axios(), { response: { status: 418 } });
  });
});

describe('401 未授權的處理', () => {
  it('不會自動清除憑證或轉址（目前的行為）', async () => {
    // 這條測試記錄現況：401 的處理分支在原始碼中是被註解掉的。
    // 影響：憑證過期時使用者會看到一連串失敗的請求卻沒有任何說明，
    // 也不會被帶去重新登入。若日後把那段註解打開，這條測試會失敗——
    // 屆時改寫成「401 會清除憑證並導向登入頁」即可。
    window.localStorage.setItem('jwt', 'expired-token');

    await runRejected(Axios(), { response: { status: 401 } });

    expect(window.localStorage.getItem('jwt')).toBe('expired-token');
  });
});
