const { test, expect } = require('@playwright/test');
const { playAudit } = require('playwright-lighthouse');

test.describe('Performance Tests', () => {

  test('Lighthouse performance audit', async ({ page }) => {
    await page.goto('https://www.activeandfitdirect.com/');
    await playAudit({
      page,
      port: 9222,
      thresholds: {
        performance: 40,
        accessibility: 100,
        'best-practices': 70,
        seo: 90,
      },
    });
  });

});