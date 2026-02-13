# API Load Test and UI Testing

This project contains a k6 load test script for testing a dynamically generated API and Playwright UI tests for website testing.

## Prerequisites

- Install k6: Download from [k6.io](https://k6.io/docs/get-started/installation/)
- Install Node.js: Download from [nodejs.org](https://nodejs.org/)
- Install Playwright: Run `npx playwright install` after installing Node.js

## Usage

### Load Testing
1. Update the `baseURL` and `endpoints` array in `load_test.js` to match your API.
2. Run the test:
   ```
   k6 run load_test.js
   ```

### UI Testing
1. Install dependencies: `npm install`
2. Run UI tests: `npm run ui-test`
3. Or run specific test: `npx playwright test ui_test.js --headed` (to see browser)

## Configuration

### Load Test
- **Stages**: The test ramps up to 10 virtual users over 30 seconds, holds for 1 minute, then ramps down.
- **Checks**: Verifies status 200 and response time under 500ms.

### UI Test Scenarios
- Homepage loading
- Product search
- Product details view
- Add to cart
- View cart
- Checkout process
- Contact page
- Responsive design check

## Troubleshooting

- If the API requires authentication, add headers or authentication logic to the script.
- Adjust `options` for different load patterns.
- For UI tests, selectors may need adjustment based on actual site structure.
- For more complex scenarios, refer to [k6 documentation](https://k6.io/docs/) and [Playwright docs](https://playwright.dev/).