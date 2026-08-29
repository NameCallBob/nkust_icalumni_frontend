/**
 * 載入指示器。
 *
 * 這個元件會開兩個 setInterval，是最容易寫出「卸載後計時器還在跑」的地方——
 * 症狀是 React 對已卸載元件 setState 的警告，長時間停留還會累積記憶體。
 */
import React from 'react';
import { act, render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

it('顯示預設的載入訊息', () => {
  render(<LoadingSpinner />);
  expect(screen.getByText(/正在載入中/)).toBeInTheDocument();
});

it('可自訂初始訊息', () => {
  render(<LoadingSpinner initialMessage="正在上傳您的照片" />);
  expect(screen.getByText(/正在上傳您的照片/)).toBeInTheDocument();
});

it('等待較久時會換上安撫訊息', () => {
  // 使用者盯著同一句話看 30 秒會以為當掉了。
  render(<LoadingSpinner />);

  act(() => {
    jest.advanceTimersByTime(15000);
  });

  expect(document.body.textContent.length).toBeGreaterThan(0);
});

it('卸載後不再有待執行的計時器', () => {
  // 沒有 clearInterval 的話，每次進出載入畫面都會留下一個永遠不停的 interval。
  const { unmount } = render(<LoadingSpinner />);
  unmount();

  expect(jest.getTimerCount()).toBe(0);
});
