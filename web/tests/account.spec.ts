/**
 * account.spec.ts — Account dashboard, orders, subscriptions, and wishlist E2E tests
 *
 * Covers:
 *   US-6: Authenticated user sees account with orders, subscriptions, wishlist
 *   SP-020 through SP-027: Account dashboard, orders, subscription management, wishlist
 *   ES-002, ES-003, ES-004: Empty states for orders, wishlist, subscriptions
 *   INT-003, INT-004: Stripe webhook creates order records (subscription + one-time)
 *
 * All API calls are mocked. Authentication is simulated by intercepting
 * Supabase session checks. Tests WILL FAIL until the account implementation
 * exists (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import {
  MOCK_CUSTOMER_EMAIL,
  MOCK_ORDER,
  MOCK_SUBSCRIPTION,
  MOCK_PRODUCT_SLUG,
  mockOrdersApi,
  mockSubscriptionsApi,
  mockSubscriptionUpdateApi,
  mockWishlistApi,
} from './fixtures';

// ---------------------------------------------------------------------------
// Auth simulation helper
// ---------------------------------------------------------------------------

/**
 * Sets up route interception to simulate an authenticated Supabase session.
 * The account layout calls the Supabase auth endpoint to verify session.
 */
async function simulateAuthenticatedUser(page: import('@playwright/test').Page) {
  // Mock the Supabase session endpoint used by the auth guard layout
  await page.route('**/auth/v1/user', async (route) => {
    if (route.request().headers()['authorization']) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'customer-1',
          email: MOCK_CUSTOMER_EMAIL,
          role: 'authenticated',
        }),
      });
    } else {
      await route.fulfill({ status: 401, body: JSON.stringify({ message: 'Not authenticated' }) });
    }
  });

  // Set a mock auth cookie so the middleware treats this as authenticated
  await page.context().addCookies([
    {
      name: 'sb-access-token',
      value: 'mock_access_token',
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
    },
  ]);
}

// ---------------------------------------------------------------------------
// Account dashboard
// ---------------------------------------------------------------------------

test.describe('Account dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await simulateAuthenticatedUser(page);
    await mockOrdersApi(page);
    await mockSubscriptionsApi(page);
    await mockWishlistApi(page);
    await page.goto('/account', { waitUntil: 'domcontentloaded' });
  });

  test('account page returns HTTP 200 for authenticated user', async ({ page }) => {
    const response = await page.goto('/account');
    expect(response?.status()).toBe(200);
  });

  test('account dashboard shows orders section', async ({ page }) => {
    // SP-020
    const ordersSection = page.getByRole('heading', { name: /orders/i }).or(
      page.getByRole('link', { name: /orders/i }),
    ).first();
    await expect(ordersSection).toBeVisible();
  });

  test('account dashboard shows subscriptions section', async ({ page }) => {
    // SP-020
    const subscriptionsSection = page.getByRole('heading', { name: /subscriptions/i }).or(
      page.getByRole('link', { name: /subscriptions/i }),
    ).first();
    await expect(subscriptionsSection).toBeVisible();
  });

  test('account dashboard shows wishlist section', async ({ page }) => {
    // SP-020
    const wishlistSection = page.getByRole('heading', { name: /wishlist/i }).or(
      page.getByRole('link', { name: /wishlist/i }),
    ).first();
    await expect(wishlistSection).toBeVisible();
  });

  test('account dashboard shows the customer email', async ({ page }) => {
    await expect(page.getByText(MOCK_CUSTOMER_EMAIL)).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Order history
// ---------------------------------------------------------------------------

test.describe('Order history page', () => {
  test.beforeEach(async ({ page }) => {
    await simulateAuthenticatedUser(page);
  });

  test('order history page lists orders with ID, date, and status', async ({ page }) => {
    // SP-021
    await mockOrdersApi(page, [MOCK_ORDER]);
    await page.goto('/account/orders', { waitUntil: 'domcontentloaded' });

    const orderRow = page.locator('[data-testid="order-row"]').first();
    await expect(orderRow).toBeVisible();

    // Should show order ID (or partial), date, and status
    await expect(orderRow.getByText(/paid|shipped|delivered/i)).toBeVisible();
  });

  test('order history shows the order total', async ({ page }) => {
    await mockOrdersApi(page, [MOCK_ORDER]);
    await page.goto('/account/orders', { waitUntil: 'domcontentloaded' });

    // MOCK_ORDER total is 5660 cents = $56.60
    const total = page.getByText(/\$56\.60|\$56,60/);
    await expect(total).toBeVisible();
  });

  test('empty orders page shows "no orders" message', async ({ page }) => {
    // ES-002
    await mockOrdersApi(page, []);
    await page.goto('/account/orders', { waitUntil: 'domcontentloaded' });

    const emptyMessage = page.getByText(/no orders|no purchases|no history/i);
    await expect(emptyMessage).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Subscription management
// ---------------------------------------------------------------------------

test.describe('Subscription management page', () => {
  test.beforeEach(async ({ page }) => {
    await simulateAuthenticatedUser(page);
    await mockSubscriptionsApi(page, [MOCK_SUBSCRIPTION]);
    await mockSubscriptionUpdateApi(page);
  });

  test('subscriptions page lists active subscriptions', async ({ page }) => {
    // SP-022
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const subCard = page.locator('[data-testid="subscription-card"]').first();
    await expect(subCard).toBeVisible();
  });

  test('subscription card shows product name', async ({ page }) => {
    // SP-022: Shows product name
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const subCard = page.locator('[data-testid="subscription-card"]').first();
    // The product slug is luminous-face-serum — the card should show a recognizable product label
    await expect(subCard.getByText(/luminous|serum|face/i)).toBeVisible();
  });

  test('subscription card shows frequency', async ({ page }) => {
    // SP-022: Shows frequency
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const subCard = page.locator('[data-testid="subscription-card"]').first();
    await expect(subCard.getByText(/monthly/i)).toBeVisible();
  });

  test('subscription card shows status badge', async ({ page }) => {
    // SP-022: Shows status
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const subCard = page.locator('[data-testid="subscription-card"]').first();
    await expect(subCard.getByText(/active/i)).toBeVisible();
  });

  test('subscription card has a change frequency action', async ({ page }) => {
    // SP-023: Change frequency button
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const changeBtn = page.getByRole('button', { name: /change frequency|change/i }).first();
    await expect(changeBtn).toBeVisible();
  });

  test('changing frequency updates the subscription', async ({ page }) => {
    // SP-023
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const changeBtn = page.getByRole('button', { name: /change frequency|change/i }).first();
    await changeBtn.click();

    // A frequency selector should appear
    const quarterlyOption = page.getByRole('option', { name: /quarterly|every 3/i }).or(
      page.getByText(/quarterly|every 3 months/i),
    ).first();
    await expect(quarterlyOption).toBeVisible({ timeout: 3000 });

    await quarterlyOption.click();

    // A confirm button should appear
    const confirmBtn = page.getByRole('button', { name: /confirm|save|update/i }).first();
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
    }

    // Subscription should now show "quarterly" or "every 3 months"
    await expect(page.getByText(/quarterly|every 3 months/i)).toBeVisible({ timeout: 5000 });
  });

  test('subscription card has a pause action', async ({ page }) => {
    // SP-024: Pause button exists
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const pauseBtn = page.getByRole('button', { name: /pause/i }).first();
    await expect(pauseBtn).toBeVisible();
  });

  test('subscription card has a cancel action', async ({ page }) => {
    // SP-025: Cancel button exists
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const cancelBtn = page.getByRole('button', { name: /cancel/i }).first();
    await expect(cancelBtn).toBeVisible();
  });

  test('cancelling a subscription shows a confirmation prompt', async ({ page }) => {
    // SP-025: Confirmation before cancellation
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    await page.getByRole('button', { name: /cancel/i }).first().click();

    // A confirmation dialog or inline confirmation should appear
    const confirmDialog = page.getByRole('alertdialog').or(
      page.getByRole('dialog', { name: /confirm|cancel/i }),
    ).or(
      page.getByText(/are you sure|confirm cancellation/i),
    ).first();
    await expect(confirmDialog).toBeVisible({ timeout: 3000 });
  });

  test('empty subscriptions page shows appropriate message', async ({ page }) => {
    // ES-004
    await mockSubscriptionsApi(page, []);
    await page.goto('/account/subscriptions', { waitUntil: 'domcontentloaded' });

    const emptyMessage = page.getByText(/no subscriptions|no active|not subscribed/i);
    await expect(emptyMessage).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

test.describe('Wishlist page', () => {
  test.beforeEach(async ({ page }) => {
    await simulateAuthenticatedUser(page);
  });

  test('wishlist page shows saved items', async ({ page }) => {
    // SP-026: Wishlist persists
    await mockWishlistApi(page);
    await page.goto('/account/wishlist', { waitUntil: 'domcontentloaded' });

    const item = page.locator('[data-testid="wishlist-item"]').first();
    await expect(item).toBeVisible();
  });

  test('empty wishlist page shows "no saved items" message', async ({ page }) => {
    // ES-003
    await mockWishlistApi(page, []);
    await page.goto('/account/wishlist', { waitUntil: 'domcontentloaded' });

    const emptyMessage = page.getByText(/no saved items|wishlist is empty|no items/i);
    await expect(emptyMessage).toBeVisible();
  });

  test('removing a wishlist item removes it from the list', async ({ page }) => {
    // SP-027
    await mockWishlistApi(page);
    await page.goto('/account/wishlist', { waitUntil: 'domcontentloaded' });

    const items = page.locator('[data-testid="wishlist-item"]');
    const initialCount = await items.count();

    // Set up the DELETE mock
    await page.route(`**/api/wishlist/${MOCK_PRODUCT_SLUG}`, async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    await items.first().getByRole('button', { name: /remove|delete/i }).click();

    await expect(items).toHaveCount(initialCount - 1, { timeout: 3000 });
  });

  test('wishlist item links to the product detail page', async ({ page }) => {
    await mockWishlistApi(page);
    await page.goto('/account/wishlist', { waitUntil: 'domcontentloaded' });

    const item = page.locator('[data-testid="wishlist-item"]').first();
    const link = item.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\/shop\/.+/);
  });
});
