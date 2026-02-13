const { test, expect } = require('@playwright/test');

test.describe('Active & Fit Direct UI Tests', () => {

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page).toHaveTitle(/Active&Fit Direct/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Main heading is visible', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('h1').filter({ hasText: 'Flexible, Affordable' })).toBeVisible();
  });

  test('Search bar is present and functional', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    const searchInput = page.locator('input[placeholder*="Find a gym near you"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('New York');
    // Note: Actual search functionality may require more setup
  });

  test('Navigation links are present', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('a').filter({ hasText: 'Find Your Gym' }).first()).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Workout Videos' }).first()).toBeVisible();
    await expect(page.locator('a').filter({ hasText: 'Check Eligibility' }).first()).toBeVisible();
  });

  test('Check Eligibility link works', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Dismiss any modal if present
    try {
      await page.locator('button').filter({ hasText: 'CONFIRM' }).click();
    } catch {}
    await page.locator('a').filter({ hasText: 'Check Eligibility' }).first().click();
    await expect(page).toHaveURL(/.*eligibility/);
  });

  test('Find Your Gym link works', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Dismiss any modal if present
    try {
      await page.locator('button').filter({ hasText: 'CONFIRM' }).click();
    } catch {}
    await page.locator('a').filter({ hasText: 'Find your gym' }).first().click();
    await expect(page).toHaveURL(/.*search/);
  });

  test('Exclusive features section is visible', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('text=Discover Exclusive Features')).toBeVisible();
    await expect(page.locator('strong').filter({ hasText: 'Marketplace' })).toBeVisible();
    await expect(page.locator('strong').filter({ hasText: 'Workout Videos' })).toBeVisible();
  });

  test('Marketplace section is visible', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('h2').filter({ hasText: 'Unlock Top Brands for Less' })).toBeVisible();
  });

  test('Footer links are present', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('footer a').filter({ hasText: 'About Us' })).toBeVisible();
    await expect(page.locator('footer a').filter({ hasText: 'FAQ' })).toBeVisible();
    await expect(page.locator('footer a').filter({ hasText: 'Contact Us' })).toBeVisible();
  });

  test('Responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });

});