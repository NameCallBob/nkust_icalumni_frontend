/**
 * LoginPage.js — Page Object Model
 * 封裝登入頁面的所有操作
 */

const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;

    // ── 元素 Locators ──
    this.emailInput = page.getByPlaceholder('請輸入您的電子郵件');
    this.passwordInput = page.getByPlaceholder('請輸入您的密碼');
    this.continueButton = page.getByRole('button', { name: '繼續' });
    this.loginButton = page.getByRole('button', { name: '登入' });
    this.forgotPasswordLink = page.getByRole('button', { name: '忘記密碼？' });
    this.rememberMeCheckbox = page.getByLabel('記住我');
    this.showPasswordToggle = page.getByRole('button', { name: /顯示|隱藏/ });
    this.editEmailButton = page.getByRole('button', { name: '編輯' });
    this.blockWarning = page.getByText('登入暫時受限');
    this.loginTitle = page.getByText('歡迎回來');
  }

  async goto() {
    await this.page.goto('/login');
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
  }

  /**
   * 執行第一步：輸入 email 並點繼續
   */
  async fillEmailAndContinue(email) {
    await this.emailInput.fill(email);
    await this.continueButton.click();
    // 等待進入密碼階段
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
  }

  /**
   * 執行第二步：輸入密碼並登入
   */
  async fillPasswordAndLogin(password) {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * 完整登入流程
   */
  async login(email, password) {
    await this.fillEmailAndContinue(email);
    await this.fillPasswordAndLogin(password);
  }

  /**
   * 驗證第一步（email 輸入階段）元素齊全
   */
  async expectEmailStageVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    await expect(this.passwordInput).not.toBeVisible();
  }

  /**
   * 驗證第二步（密碼輸入階段）元素齊全
   */
  async expectPasswordStageVisible() {
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.loginButton).toBeEnabled();
    await expect(this.editEmailButton).toBeVisible();
  }

  /**
   * 驗證登入成功後跳轉至管理頁
   */
  async expectLoginSuccess() {
    await this.page.waitForURL('**/alumni/manage/**', { timeout: 15000 });
  }

  /**
   * 驗證登入失敗訊息
   */
  async expectLoginFailure() {
    const toast = this.page.locator('.Toastify__toast--error, .Toastify__toast--warning');
    await expect(toast).toBeVisible({ timeout: 8000 });
  }

  /**
   * 驗證封鎖倒計時出現
   */
  async expectBlockState() {
    await expect(this.blockWarning).toBeVisible({ timeout: 3000 });
    await expect(this.loginButton).toBeDisabled();
  }

  /**
   * 切換密碼顯示/隱藏
   */
  async togglePasswordVisibility() {
    const typeBefore = await this.passwordInput.getAttribute('type');
    await this.showPasswordToggle.click();
    const typeAfter = await this.passwordInput.getAttribute('type');
    expect(typeBefore).not.toEqual(typeAfter);
    return typeAfter;
  }

  /**
   * 回到 email 輸入階段
   */
  async backToEmailStage() {
    await this.editEmailButton.click();
    await expect(this.emailInput).toBeVisible({ timeout: 3000 });
    await expect(this.passwordInput).not.toBeVisible();
  }
}

module.exports = { LoginPage };
