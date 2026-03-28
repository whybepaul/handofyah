/**
 * auth.spec.ts — Authentication flow E2E tests
 *
 * Covers:
 *   US-6: Returning customer logs in to account
 *   SP-018: Magic link signup sends email confirmation
 *   SP-019: Auth callback creates customer record and redirects
 *   FS-001: Invalid email on magic link shows error
 *   FS-003, FS-004: Accessing /account/* without auth redirects to /login
 *   INT-001: Supabase signInWithOtp is called with the submitted email
 *
 * Supabase calls are intercepted via page.route() so no live Supabase
 * credentials are required. Tests WILL FAIL until the auth implementation
 * exists (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import { mockMagicLinkRequest, MOCK_CUSTOMER_EMAIL } from './fixtures';

// ---------------------------------------------------------------------------
// Magic link signup / login
// ---------------------------------------------------------------------------

test.describe('Magic link signup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded' });
  });

  test('login page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).toBe(200);
  });

  test('login page has an email input field', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();
  });

  test('login page has a submit button', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /send|magic link|sign in/i });
    await expect(submitBtn).toBeVisible();
  });

  test('submitting valid email shows "check your email" confirmation message', async ({ page }) => {
    // SP-018 / INT-001: Supabase OTP call triggers
    await mockMagicLinkRequest(page);
    await page.goto('/login', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByRole('textbox', { name: /email/i });
    await emailInput.fill(MOCK_CUSTOMER_EMAIL);

    const submitBtn = page.getByRole('button', { name: /send|magic link|sign in/i });
    await submitBtn.click();

    // After submission, UI should confirm the link was sent
    const confirmation = page.getByText(/check your email|magic link sent|link sent/i);
    await expect(confirmation).toBeVisible({ timeout: 5000 });
  });

  test('submitting valid email calls Supabase signInWithOtp with the correct email', async ({ page }) => {
    // INT-001: Verify the OTP endpoint is called with the submitted email
    let otpRequestBody: string | null = null;

    await page.route('**/auth/v1/otp', async (route) => {
      otpRequestBody = route.request().postData();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    });

    await page.goto('/login', { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: /email/i }).fill(MOCK_CUSTOMER_EMAIL);
    await page.getByRole('button', { name: /send|magic link|sign in/i }).click();

    await page.waitForTimeout(1000);

    // The OTP request should contain the email we submitted
    expect(otpRequestBody).not.toBeNull();
    expect(otpRequestBody).toContain(MOCK_CUSTOMER_EMAIL);
  });

  test('invalid email format shows a validation error', async ({ page }) => {
    // FS-001: Invalid email shows error, no network request
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await emailInput.fill('not-an-email');

    await page.getByRole('button', { name: /send|magic link|sign in/i }).click();

    const error = page.locator('[role="alert"]').or(
      page.getByText(/valid email|invalid email/i),
    ).first();
    await expect(error).toBeVisible({ timeout: 3000 });
  });

  test('empty email shows a validation error without making a network request', async ({ page }) => {
    // FS-001 variant: empty submission
    let otpCalled = false;
    await page.route('**/auth/v1/otp', async (route) => {
      otpCalled = true;
      await route.continue();
    });

    await page.getByRole('button', { name: /send|magic link|sign in/i }).click();

    // Should show an error and NOT call the OTP endpoint
    const error = page.locator('[role="alert"]').or(
      page.getByText(/required|enter.*email/i),
    ).first();
    await expect(error).toBeVisible({ timeout: 3000 });
    expect(otpCalled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Auth callback (magic link landing)
// ---------------------------------------------------------------------------

test.describe('Auth callback', () => {
  test('callback page with valid token redirects to /account', async ({ page }) => {
    // SP-019: Successful magic link callback redirects to /account
    // Intercept the Supabase token exchange
    await page.route('**/auth/v1/token*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock_access_token',
          token_type: 'bearer',
          expires_in: 3600,
          user: {
            id: 'customer-1',
            email: MOCK_CUSTOMER_EMAIL,
          },
        }),
      });
    });

    // Simulate arriving at the callback URL with a hash fragment
    // (Supabase magic links include the token in the URL hash)
    await page.goto('/auth/callback#access_token=mock_access_token&type=magiclink');

    await expect(page).toHaveURL(/\/account/, { timeout: 10_000 });
  });
});

// ---------------------------------------------------------------------------
// Protected route redirects
// ---------------------------------------------------------------------------

test.describe('Protected routes redirect unauthenticated users', () => {
  // Ensure no session cookies are present
  test.use({ storageState: { cookies: [], origins: [] } });

  const PROTECTED_ROUTES = [
    '/account',
    '/account/orders',
    '/account/subscriptions',
    '/account/wishlist',
    '/account/settings',
  ];

  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to /login when unauthenticated`, async ({ page }) => {
      // FS-003, FS-004
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    });
  }
});
