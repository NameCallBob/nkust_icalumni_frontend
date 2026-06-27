/**
 * SearchPage.js — Page Object Model
 */

const { expect } = require('@playwright/test');

class SearchPage {
  constructor(page) {
    this.page = page;

    // ── 搜尋元素 ──
    this.searchInput = page.getByPlaceholder(/搜尋|輸入|search/i).first();
    this.searchButton = page.getByRole('button', { name: /搜尋|查詢|Search/i }).first();
    this.resetButton = page.getByRole('button', { name: /重設|清除|Reset/i }).first();

    // ── 篩選元素 ──
    this.industryFilter = page.getByRole('combobox').first();
    this.filterOptions = page.locator('option, [role="option"]');

    // ── 結果區 ──
    this.results = page.locator('[class*="result"], [class*="card"], .company-card').first();
    this.resultItems = page.locator('[class*="result"], [class*="card"], .company-card');
    this.noResultMessage = page.getByText(/沒有|查無|No result/i).first();

    // ── 分頁 ──
    this.pagination = page.locator('.pagination, [class*="paginate"]').first();
  }

  async goto() {
    await this.page.goto('/search');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async clearSearch() {
    await this.searchInput.clear();
    if ((await this.resetButton.count()) > 0) {
      await this.resetButton.click();
    }
  }

  async expectResultsVisible() {
    const hasResults = (await this.resultItems.count()) > 0;
    const hasNoResult = await this.noResultMessage.isVisible().catch(() => false);
    expect(hasResults || hasNoResult, '搜尋頁應顯示結果或「無結果」訊息').toBeTruthy();
  }
}

module.exports = { SearchPage };
