/**
 * playwright.config.ts — Hand of Yah E2E test configuration
 *
 * Tests run against a local Next.js dev server by default.
 * Set BASE_URL to target a deployed environment (staging, production).
 *
 * These tests are written TDD-first: they WILL FAIL until the implementation
 * exists. That is expected and correct behavior (Red phase).
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  // Run tests in parallel within each file but not across files
  // to avoid interference between cart/auth state.
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    // Consistent viewport for desktop tests
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // When running locally, start the Next.js dev server automatically.
  // In CI, the server is started externally before tests run.
  webServer: process.env.CI
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
