/**
 * ManagerPage.js — Page Object Model（管理端通用）
 */

const { expect } = require('@playwright/test');

class ManagerPage {
  constructor(page) {
    this.page = page;

    // ── Manager 導航 ──
    this.managerNav = page.locator('.manager-nav, [class*="manager"] nav, aside nav').first();
    this.navItems = page.locator('aside a, .sidebar a, nav a').filter({ hasNotText: '' });

    // ── 常見操作按鈕 ──
    this.addButton = page.getByRole('button', { name: /新增|Add|建立|Create/ });
    this.editButton = page.getByRole('button', { name: /編輯|Edit/ });
    this.deleteButton = page.getByRole('button', { name: /刪除|Delete/ });
    this.saveButton = page.getByRole('button', { name: /儲存|Save|確認/ });
    this.cancelButton = page.getByRole('button', { name: /取消|Cancel/ });
    this.searchButton = page.getByRole('button', { name: /搜尋|查詢|Search/ });
    this.resetButton = page.getByRole('button', { name: /重設|Reset|清除/ });

    // ── 表格 ──
    this.table = page.locator('table, .p-datatable, .data-table').first();
    this.tableRows = page.locator('tbody tr, .p-datatable-tbody tr');

    // ── 分頁 ──
    this.pagination = page.locator('.pagination, .p-paginator, [class*="paginate"]').first();
    this.nextPageBtn = page.getByRole('button', { name: /Next|下一頁/ });
    this.prevPageBtn = page.getByRole('button', { name: /Previous|上一頁/ });

    // ── Modal ──
    this.modal = page.locator('.modal, [role="dialog"]').first();
    this.modalCloseBtn = page.locator('.modal .btn-close, .modal [aria-label="Close"]').first();

    // ── Confirm Dialog ──
    this.confirmBtn = page.getByRole('button', { name: /確認|Confirm|確定/ });
  }

  async gotoMain() {
    await this.page.goto('/alumni/manage/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoMemberManage() {
    await this.page.goto('/alumni/manage/member/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoArticleManage() {
    await this.page.goto('/alumni/manage/article/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoRecruitManage() {
    await this.page.goto('/alumni/manage/recruit/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoCompanyManage() {
    await this.page.goto('/alumni/manage/company/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoPicManage() {
    await this.page.goto('/alumni/manage/pic/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoProductManage() {
    await this.page.goto('/alumni/manage/product/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoWebsiteManage() {
    await this.page.goto('/alumni/manage/website/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * 驗證管理頁面基本結構
   */
  async expectManagePageLoaded() {
    await this.page.waitForLoadState('domcontentloaded');
    const bodyText = await this.page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(10);
    // 不應跳轉至登入頁
    expect(this.page.url()).not.toContain('/login');
  }

  /**
   * 開啟新增 Modal 並驗證
   */
  async openAddModal() {
    const addBtn = this.addButton.first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await expect(addBtn).toBeEnabled();
    await addBtn.click();
    await expect(this.modal).toBeVisible({ timeout: 5000 });
    return this.modal;
  }

  /**
   * 關閉 Modal
   */
  async closeModal() {
    await this.modalCloseBtn.click();
    await expect(this.modal).not.toBeVisible({ timeout: 5000 });
  }

  /**
   * 驗證表格有資料列
   */
  async expectTableHasRows(minRows = 1) {
    await expect(this.table).toBeVisible({ timeout: 10000 });
    const rowCount = await this.tableRows.count();
    expect(rowCount, `表格應至少有 ${minRows} 列資料`).toBeGreaterThanOrEqual(minRows);
  }

  /**
   * 驗證沒有未定義的 JS 錯誤（頁面未白屏）
   */
  async expectNoJSErrors() {
    const errors = [];
    this.page.on('pageerror', (err) => errors.push(err.message));
    expect(errors.length, `偵測到 JS 錯誤：${errors.join(', ')}`).toBe(0);
  }
}

module.exports = { ManagerPage };
