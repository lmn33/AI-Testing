const { test, expect } = require('@playwright/test');
const { playAudit } = require('playwright-lighthouse');
const fs = require('fs');
const path = require('path');

// Helper function to calculate median
function calculateMedian(values) {
  const filtered = values.filter(v => v !== null && v !== undefined);
  if (filtered.length === 0) return null;
  
  filtered.sort((a, b) => a - b);
  const mid = Math.floor(filtered.length / 2);
  return filtered.length % 2 !== 0 
    ? filtered[mid] 
    : (filtered[mid - 1] + filtered[mid]) / 2;
}

test.describe('Performance Tests', () => {

  test('Lighthouse performance audit - 10 runs with median', async ({ page }) => {
    const NUM_RUNS = 10;
    const allRuns = [];
    
    try {
      console.log(`Starting 10 Lighthouse audit runs...`);
      
      for (let i = 1; i <= NUM_RUNS; i++) {
        console.log(`Run ${i}/${NUM_RUNS}...`);
        await page.goto('https://www.activeandfitdirect.com/');
        
        const results = await playAudit({
          page,
          port: 9222,
          thresholds: {
            performance: 40,
            accessibility: 100,
            'best-practices': 70,
            seo: 90,
          },
        });

        const runMetrics = {
          runNumber: i,
          scores: {
            performance: results.lhr.categories.performance.score * 100,
            accessibility: results.lhr.categories.accessibility.score * 100,
            'best-practices': results.lhr.categories['best-practices'].score * 100,
            seo: results.lhr.categories.seo.score * 100,
          },
          metrics: {
            performance: {
              firstContentfulPaint: results.lhr.audits['first-contentful-paint'].numericValue,
              largestContentfulPaint: results.lhr.audits['largest-contentful-paint'].numericValue,
              cumulativeLayoutShift: results.lhr.audits['cumulative-layout-shift'].numericValue,
              totalBlockingTime: results.lhr.audits['total-blocking-time'].numericValue,
            },
            accessibility: {
              colorContrast: results.lhr.audits['color-contrast']?.score * 100 || null,
              ariaRequiredAttributes: results.lhr.audits['aria-required-attributes']?.score * 100 || null,
              ariaValidRoles: results.lhr.audits['aria-valid-role']?.score * 100 || null,
              imageAlt: results.lhr.audits['image-alt']?.score * 100 || null,
              labelElements: results.lhr.audits['label']?.score * 100 || null,
            },
            bestPractices: {
              usesHttps: results.lhr.audits['is-on-https']?.score * 100 || null,
              noConsoleErrors: results.lhr.audits['errors-in-console']?.score * 100 || null,
              noUnusedJavaScript: results.lhr.audits['unused-javascript']?.score * 100 || null,
              documentTitle: results.lhr.audits['document-title']?.score * 100 || null,
            },
            seo: {
              metaDescription: results.lhr.audits['meta-description']?.score * 100 || null,
              viewport: results.lhr.audits['viewport']?.score * 100 || null,
              fontSizes: results.lhr.audits['font-size']?.score * 100 || null,
              mobileFriendly: results.lhr.audits['mobile-friendly']?.score * 100 || null,
              canonicalUrl: results.lhr.audits['canonical']?.score * 100 || null,
            },
          },
        };
        
        allRuns.push(runMetrics);
      }

      // Calculate medians
      const medianMetrics = {
        timestamp: new Date().toISOString(),
        url: 'https://www.activeandfitdirect.com/',
        totalRuns: NUM_RUNS,
        medianScores: {
          performance: calculateMedian(allRuns.map(r => r.scores.performance)),
          accessibility: calculateMedian(allRuns.map(r => r.scores.accessibility)),
          'best-practices': calculateMedian(allRuns.map(r => r.scores['best-practices'])),
          seo: calculateMedian(allRuns.map(r => r.scores.seo)),
        },
        medianMetrics: {
          performance: {
            firstContentfulPaint: calculateMedian(allRuns.map(r => r.metrics.performance.firstContentfulPaint)),
            largestContentfulPaint: calculateMedian(allRuns.map(r => r.metrics.performance.largestContentfulPaint)),
            cumulativeLayoutShift: calculateMedian(allRuns.map(r => r.metrics.performance.cumulativeLayoutShift)),
            totalBlockingTime: calculateMedian(allRuns.map(r => r.metrics.performance.totalBlockingTime)),
          },
          accessibility: {
            colorContrast: calculateMedian(allRuns.map(r => r.metrics.accessibility.colorContrast)),
            ariaRequiredAttributes: calculateMedian(allRuns.map(r => r.metrics.accessibility.ariaRequiredAttributes)),
            ariaValidRoles: calculateMedian(allRuns.map(r => r.metrics.accessibility.ariaValidRoles)),
            imageAlt: calculateMedian(allRuns.map(r => r.metrics.accessibility.imageAlt)),
            labelElements: calculateMedian(allRuns.map(r => r.metrics.accessibility.labelElements)),
          },
          bestPractices: {
            usesHttps: calculateMedian(allRuns.map(r => r.metrics.bestPractices.usesHttps)),
            noConsoleErrors: calculateMedian(allRuns.map(r => r.metrics.bestPractices.noConsoleErrors)),
            noUnusedJavaScript: calculateMedian(allRuns.map(r => r.metrics.bestPractices.noUnusedJavaScript)),
            documentTitle: calculateMedian(allRuns.map(r => r.metrics.bestPractices.documentTitle)),
          },
          seo: {
            metaDescription: calculateMedian(allRuns.map(r => r.metrics.seo.metaDescription)),
            viewport: calculateMedian(allRuns.map(r => r.metrics.seo.viewport)),
            fontSizes: calculateMedian(allRuns.map(r => r.metrics.seo.fontSizes)),
            mobileFriendly: calculateMedian(allRuns.map(r => r.metrics.seo.mobileFriendly)),
            canonicalUrl: calculateMedian(allRuns.map(r => r.metrics.seo.canonicalUrl)),
          },
        },
        allRuns: allRuns,
      };

      // Save metrics to file
      const metricsDir = path.join(__dirname, '../../metrics');
      if (!fs.existsSync(metricsDir)) {
        fs.mkdirSync(metricsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const metricsFile = path.join(metricsDir, `lighthouse-metrics-${timestamp}.json`);
      
      fs.writeFileSync(metricsFile, JSON.stringify(medianMetrics, null, 2));
      console.log(`\nMetrics saved to: ${metricsFile}`);
      console.log(`\nMedian Results:`);
      console.log(`Performance: ${medianMetrics.medianScores.performance.toFixed(2)}`);
      console.log(`Accessibility: ${medianMetrics.medianScores.accessibility.toFixed(2)}`);
      console.log(`Best Practices: ${medianMetrics.medianScores['best-practices'].toFixed(2)}`);
      console.log(`SEO: ${medianMetrics.medianScores.seo.toFixed(2)}`);
    } catch (error) {
      console.error('Lighthouse audit failed:', error);
      throw error;
    }
  });

});