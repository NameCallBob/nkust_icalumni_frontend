/**
 * useRWD：全站共用的響應式斷點 hook。
 *
 * 它決定了表格用卡片還是捲動、按鈕要不要滿版、一列放幾張卡。斷點判斷錯了不會
 * 有任何錯誤訊息，只會在某些螢幕尺寸下版面壞掉——而那正是最難靠人工發現的問題。
 */
import { renderHook, act } from '@testing-library/react';
import useRWD from '../useRWD';

/** 改變視窗寬度並觸發 resize 事件。 */
const resizeTo = (width, height = 800) => {
  act(() => {
    window.innerWidth = width;
    window.innerHeight = height;
    window.dispatchEvent(new Event('resize'));
  });
};

describe('斷點判斷', () => {
  it.each([
    ['手機', 375, { isMobile: true, isTablet: false, isDesktop: false }],
    ['斷點下緣 575', 575, { isMobile: true, isTablet: false, isDesktop: false }],
    ['平板下緣 576', 576, { isMobile: false, isTablet: true, isDesktop: false }],
    ['平板 768', 768, { isMobile: false, isTablet: true, isDesktop: false }],
    ['平板上緣 991', 991, { isMobile: false, isTablet: true, isDesktop: false }],
    ['桌機下緣 992', 992, { isMobile: false, isTablet: false, isDesktop: true }],
    ['大螢幕 1920', 1920, { isMobile: false, isTablet: false, isDesktop: true }],
  ])('%s（%ipx）', (_label, width, expected) => {
    // 斷點的邊界值是最容易寫成 > 而非 >= 的地方，所以逐一釘死。
    const { result } = renderHook(() => useRWD());
    resizeTo(width);

    expect(result.current.isMobile).toBe(expected.isMobile);
    expect(result.current.isTablet).toBe(expected.isTablet);
    expect(result.current.isDesktop).toBe(expected.isDesktop);
  });

  it('三種裝置狀態永遠互斥且必有其一', () => {
    const { result } = renderHook(() => useRWD());
    for (const width of [320, 480, 576, 768, 992, 1200, 1920]) {
      resizeTo(width);
      const flags = [result.current.isMobile, result.current.isTablet, result.current.isDesktop];
      expect(flags.filter(Boolean)).toHaveLength(1);
    }
  });

  it('會跟著視窗尺寸更新', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(1920, 1080);
    expect(result.current.screenWidth).toBe(1920);
    expect(result.current.screenHeight).toBe(1080);

    resizeTo(375, 667);
    expect(result.current.screenWidth).toBe(375);
  });
});

describe('卸載後不再監聽 resize', () => {
  it('移除事件監聽器（否則每次換頁都會累積一個 listener）', () => {
    const removeSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useRWD());

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});

describe('版面設定函數', () => {
  it('手機用卡片式表格、操作收進下拉選單', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(375);

    const config = result.current.getTableResponsiveConfig();
    expect(config.tableLayout).toBe('card');
    expect(config.actionsPosition).toBe('dropdown');
  });

  it('平板用橫向捲動表格', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(700);
    expect(result.current.getTableResponsiveConfig().tableLayout).toBe('scroll');
  });

  it('桌機用固定表格並顯示全部欄位', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(1440);

    const config = result.current.getTableResponsiveConfig();
    expect(config.tableLayout).toBe('fixed');
    expect(config.showColumns).toBe('all');
  });

  it('卡片欄數隨螢幕寬度遞增', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    const mobile = result.current.getCardColumns();
    resizeTo(700);
    const tablet = result.current.getCardColumns();
    resizeTo(1000);
    const desktop = result.current.getCardColumns();
    resizeTo(1600);
    const large = result.current.getCardColumns();

    expect(mobile).toBe(1);
    expect([mobile, tablet, desktop, large]).toEqual([1, 2, 3, 4]);
  });

  it('字級隨螢幕放大，且未知類型退回 body 而不是 undefined', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    const mobileH1 = parseInt(result.current.getFontSize('h1'), 10);
    expect(result.current.getFontSize('not-a-type')).toBe(result.current.getFontSize('body'));

    resizeTo(1440);
    const desktopH1 = parseInt(result.current.getFontSize('h1'), 10);
    expect(desktopH1).toBeGreaterThan(mobileH1);
  });

  it('間距隨螢幕放大，且未知尺寸退回 medium', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    expect(result.current.getSpacing('not-a-size')).toBe(result.current.getSpacing('medium'));

    const mobileLarge = parseInt(result.current.getSpacing('large'), 10);
    resizeTo(1440);
    expect(parseInt(result.current.getSpacing('large'), 10)).toBeGreaterThan(mobileLarge);
  });

  it('手機上 block 型按鈕滿版', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(375);
    expect(result.current.getButtonStyle('block').width).toBe('100%');

    resizeTo(1440);
    expect(result.current.getButtonStyle('block').width).toBe('auto');
  });
});

describe('容器與表格樣式', () => {
  it('手機的表格改為 block + 橫向捲動，避免版面被撐爆', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(375);

    const style = result.current.getTableStyle();
    expect(style.display).toBe('block');
    expect(style.overflowX).toBe('auto');
  });

  it('平板的表格保留橫向捲動但不改 display', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(700);

    const style = result.current.getTableStyle();
    expect(style.overflowX).toBe('auto');
    expect(style.display).toBeUndefined();
  });

  it('桌機的表格使用 fixed layout', () => {
    const { result } = renderHook(() => useRWD());
    resizeTo(1440);
    expect(result.current.getTableStyle().tableLayout).toBe('fixed');
  });

  it('容器在手機上不置中留白，在桌機上限制最大寬度', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    expect(result.current.getContainerStyle().margin).toBe('0');

    resizeTo(700);
    expect(result.current.getContainerStyle().maxWidth).toBe('100%');

    resizeTo(1440);
    expect(result.current.getContainerStyle().maxWidth).toBe('1200px');
  });

  it('按鈕在各裝置上的內距遞增', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    const mobile = result.current.getButtonStyle();
    resizeTo(700);
    const tablet = result.current.getButtonStyle();
    resizeTo(1440);
    const desktop = result.current.getButtonStyle();

    expect(mobile.fontSize).toBe('14px');
    expect(tablet.fontSize).toBe('15px');
    expect(desktop.fontSize).toBe('16px');
    expect(desktop.marginBottom).toBe('0');
  });
});

describe('renderForDevice', () => {
  it('平板沒有專屬內容時退回桌機版本，而不是回傳 undefined', () => {
    // 回 undefined 會讓該區塊在平板上整個消失——這是實際發生過的類型的 bug。
    const { result } = renderHook(() => useRWD());
    resizeTo(700);
    expect(result.current.renderForDevice('手機', undefined, '桌機')).toBe('桌機');
  });

  it('依裝置回傳對應內容', () => {
    const { result } = renderHook(() => useRWD());

    resizeTo(375);
    expect(result.current.renderForDevice('手機', '平板', '桌機')).toBe('手機');

    resizeTo(700);
    expect(result.current.renderForDevice('手機', '平板', '桌機')).toBe('平板');

    resizeTo(1440);
    expect(result.current.renderForDevice('手機', '平板', '桌機')).toBe('桌機');
  });
});
