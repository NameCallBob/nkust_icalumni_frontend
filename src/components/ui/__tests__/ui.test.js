/** UI 元件庫煙霧測試：確認 API 與呼叫端的用法相符（props、無障礙名稱、互動）。 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Inbox } from 'lucide-react';
import {
  Button, Field, Pagination, ConfirmDialog, EmptyState, Spinner, Badge, Alert, Switch,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { validatePassword } from 'utils/validatePassword';
import { mediaUrl } from '@/services';

describe('cn', () => {
  it('後面的 Tailwind class 覆蓋前面衝突的', () => {
    expect(cn('h-11 px-2', 'h-12', false && 'x')).toBe('px-2 h-12');
  });
});

describe('Button', () => {
  it('loading 時禁用並不觸發 onClick', async () => {
    const onClick = jest.fn();
    render(<Button loading onClick={onClick}>送出</Button>);
    const btn = screen.getByRole('button', { name: /送出/ });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Field', () => {
  it('label 與 input 關聯、required 有星號、error 以 alert 顯示', () => {
    render(<Field label="標題" required error="必填" />);
    const input = screen.getByLabelText(/標題/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('必填');
  });
  it('as=textarea 渲染 textarea，className 套在外層', () => {
    const { container } = render(<Field as="textarea" label="描述" rows={3} className="outer" />);
    expect(container.querySelector('textarea')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('outer');
  });
});

describe('Pagination', () => {
  it('只有一頁時不渲染', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('點頁碼與上下頁會回呼', async () => {
    const onPageChange = jest.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onPageChange} />);
    await userEvent.click(screen.getByRole('button', { name: '下一頁' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: '5' }));
    expect(onPageChange).toHaveBeenLastCalledWith(5);
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('ConfirmDialog', () => {
  it('確認鈕觸發 onConfirm，取消鈕關閉', async () => {
    const onConfirm = jest.fn();
    const onOpenChange = jest.fn();
    render(
      <ConfirmDialog open onOpenChange={onOpenChange} title="確認刪除？" confirmText="刪除" onConfirm={onConfirm} destructive />
    );
    expect(screen.getByRole('dialog', { name: '確認刪除？' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '刪除' }));
    expect(onConfirm).toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: '取消' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('其他元件', () => {
  it('EmptyState 接受 lucide 元件或元素作為 icon', () => {
    const { rerender, container } = render(<EmptyState icon={Inbox} title="空" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    rerender(<EmptyState icon={<Inbox />} title="空" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('Spinner 有 status 角色與 label', () => {
    render(<Spinner center label="載入中..." />);
    expect(screen.getByRole('status')).toHaveTextContent('載入中...');
  });
  it('Badge / Alert 渲染內容', () => {
    render(<><Badge variant="soft-success">招募中</Badge><Alert variant="destructive">壞了</Alert></>);
    expect(screen.getByText('招募中')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('壞了');
  });
  it('Switch 切換呼叫 onCheckedChange', async () => {
    const onCheckedChange = jest.fn();
    render(<Switch aria-label="繳費" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole('switch', { name: '繳費' }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

describe('validatePassword', () => {
  it.each([
    ['short1A', false],
    ['alllowercase1', false],
    ['ALLUPPERCASE1', false],
    ['NoDigitsHere', false],
    ['Valid1234', true],
    [undefined, false],
  ])('%s -> %s', (pwd, valid) => {
    expect(validatePassword(pwd).valid).toBe(valid);
  });
});

describe('mediaUrl', () => {
  it('空值回空字串、完整網址原樣、相對路徑接 BASE_URL', () => {
    expect(mediaUrl(null)).toBe('');
    expect(mediaUrl('https://x.test/a.pdf')).toBe('https://x.test/a.pdf');
    expect(mediaUrl('/media/a.pdf')).toMatch(/\/media\/a\.pdf$/);
  });
});
