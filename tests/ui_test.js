const { test, expect } = require('@playwright/test');

test.describe('Active & Fit Direct UI Tests', () => {

  test('Homepage loads successfully', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page).toHaveTitle(/Active & Fit Direct/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('Search for products', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Assuming there's a search bar, adjust selector as needed
    const searchInput = page.locator('input[name="search"]') || page.locator('#search-input');
    await searchInput.fill('treadmill');
    await searchInput.press('Enter');
    await expect(page.locator('.product-list')).toBeVisible(); // Adjust selector
  });

  test('View product details', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Click on a product link, adjust selector
    await page.locator('.product-item a').first().click();
    await expect(page.locator('.product-details')).toBeVisible();
  });

  test('Add product to cart', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Navigate to a product page
    await page.locator('.product-item a').first().click();
    // Click add to cart button, adjust selector
    await page.locator('button.add-to-cart').click();
    await expect(page.locator('.cart-notification')).toBeVisible(); // Adjust
  });

  test('View cart', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    // Assuming cart link exists
    await page.locator('.cart-link').click();
    await expect(page.locator('.cart-items')).toBeVisible();
  });

  test('Checkout process', async ({ page }) => {
    // This might require login, so basic check
    await page.goto('https://www.activeandfitdirect.com/cart'); // Adjust URL
    await expect(page.locator('.checkout-button')).toBeVisible();
  });

  test('Contact page', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/contact');
    await expect(page.locator('form.contact-form')).toBeVisible();
  });

  test('Responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://www.activeandfitdirect.com/');
    await expect(page.locator('nav')).toBeVisible();
  });

});