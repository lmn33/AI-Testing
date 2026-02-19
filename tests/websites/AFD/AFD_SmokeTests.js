const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests for Active & Fit Direct', () => {

  const baseURL = 'https://www.activeandfitdirect.com/';

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page).toHaveTitle(/Active&Fit Direct/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Main heading is visible', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('h1').filter({ hasText: 'Flexible, Affordable' })).toBeVisible();
  });

  test('Gym search bar is present', async ({ page }) => {
    await page.goto(baseURL);
    const searchInput = page.locator('input[placeholder*="Find a gym near you"]');
    await expect(searchInput).toBeVisible();
  });

  test('Check Eligibility link navigates correctly', async ({ page }) => {
    await page.goto(baseURL);
    try {
      await page.locator('button').filter({ hasText: 'CONFIRM' }).click();
    } catch {}
    await page.locator('a').filter({ hasText: 'Check Eligibility' }).first().click();
    await expect(page).toHaveURL(/.*eligibility/);
  });

  test('Find Your Gym link navigates correctly', async ({ page }) => {
    await page.goto(baseURL);
    try {
      await page.locator('button').filter({ hasText: 'CONFIRM' }).click();
    } catch {}
    await page.locator('a').filter({ hasText: 'Find your gym' }).first().click();
    await expect(page).toHaveURL(/.*search/);
  });

  test('Workout Videos link is present', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('a').filter({ hasText: 'Workout Videos' }).first()).toBeVisible();
  });

  test('Exclusive features section is visible', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('text=Discover Exclusive Features')).toBeVisible();
  });

  test('Marketplace section is visible', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('h2').filter({ hasText: 'Unlock Top Brands for Less' })).toBeVisible();
  });

  test('Footer links are present', async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('footer a').filter({ hasText: 'About Us' })).toBeVisible();
    await expect(page.locator('footer a').filter({ hasText: 'FAQ' })).toBeVisible();
    await expect(page.locator('footer a').filter({ hasText: 'Contact Us' })).toBeVisible();
  });

  test('Mobile responsiveness - homepage loads', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseURL);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

  test('Mobile responsiveness - search functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(baseURL);
    const searchInput = page.locator('input[placeholder*="Find a gym near you"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('92101');
    await page.keyboard.press('Enter');
    await expect(searchInput).toHaveValue('92101');
    await expect(page.locator('body')).toContainText('92101');
  });

  test('Search page fires Google Analytics requests', async ({ page }) => {
    const searchUrl = `${baseURL}search`;
    const gaHits = [];

    page.on('request', (req) => {
      const u = req.url();
      if (/google-analytics\.com|analytics\.google\.com|googletagmanager\.com/.test(u)) {
        gaHits.push(u);
      }
    });

    await page.goto(searchUrl);
    try {
      await page.locator('button').filter({ hasText: 'CONFIRM' }).click();
    } catch {}

    const gaPattern = /google-analytics\.com|analytics\.google\.com|googletagmanager\.com/;
    try {
      const req = await page.waitForRequest(r => gaPattern.test(r.url()), { timeout: 15000 });
      gaHits.push(req.url());
    } catch (e) {
      // no matching request within timeout
    }

    await expect(gaHits.length).toBeGreaterThan(0);
  });

});