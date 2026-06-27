/**
 * HomePage.js — Page Object Model
 */

const { expect } = require('@playwright/test');

class HomePage {
  constructor(page) {
    this.page = page;

    // ── 導航 ──
    this.navbar = page.locator('nav, .navbar, header').first();
    this.navLinks = page.locator('nav a, .navbar a');

    // ── 主要區塊 ──
    this.heroSection = page.locator('.hero, .hero-section, [class*="hero"]').first();
    this.mainContent = page.locator('main, #root, .app').first();

    // ── 常見 CTA 按鈕 ──
    this.ctaButtons = page.getByRole('button').filter({ hasNotText: '' });

    // ── 輪播 ──
    this.slider = page.locator('.slick-slider, .swiper, [class*="carousel"]').first();

    // ── Modal（彈窗廣告）──
    this.posterModal = page.locator('.modal, [role="dialog"]').first();
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectPageLoaded() {
    await expect(this.mainContent).toBeVisible({ timeout: 15000 });
    const bodyText = await this.page.locator('body').textContent();
    expect(bodyText?.trim().length).toBeGreaterThan(50);
  }

  async expectNavbarVisible() {
    await expect(this.navbar).toBeVisible();
    const linkCount = await this.navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  }

  async navigateToLogin() {
    const loginLink = this.page.getByRole('link', { name: /登入|Login/ });
    await loginLink.click();
    await this.page.waitForURL('**/login**');
  }

  async navigateToSearch() {
    await this.page.goto('/search');
  }
}

module.exports = { HomePage };
