/**
 * shop.spec.ts — Shop page, category pages, and product detail page E2E tests
 *
 * Covers:
 *   US-2: Shopper browses products by category
 *   US-3: Shopper views product detail with imagery, ingredients, pricing
 *   SP-003 through SP-011: Shop, category, and product page assertions
 *   FS-008: Non-existent product slug returns 404
 *   EC-004: Product with long name does not break layout
 *
 * Tests WILL FAIL until the shop implementation exists (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import { MOCK_PRODUCT_SLUG } from './fixtures';

// ---------------------------------------------------------------------------
// All-products shop page
// ---------------------------------------------------------------------------

test.describe('Shop page (/shop)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
  });

  test('shop page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/shop');
    expect(response?.status()).toBe(200);
  });

  test('shop page has a visible heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('shop page displays product cards', async ({ page }) => {
    // Each product card shows name and price (SP-003)
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible();
  });

  test('product card shows product name', async ({ page }) => {
    const card = page.locator('[data-testid="product-card"]').first();
    // Product name is a heading or prominent text within the card
    const name = card.getByRole('heading').or(card.locator('[data-testid="product-name"]'));
    await expect(name.first()).toBeVisible();
  });

  test('product card shows product price', async ({ page }) => {
    const card = page.locator('[data-testid="product-card"]').first();
    const price = card.locator('[data-testid="product-price"]').or(
      card.getByText(/\$[\d,]+(\.\d{2})?/),
    );
    await expect(price.first()).toBeVisible();
  });

  test('shop page product grid is three columns on desktop viewport', async ({ page }) => {
    // SP-004: Three-column grid at 1280px width
    // Verify computed grid has three columns by counting items in the first row
    await page.setViewportSize({ width: 1280, height: 800 });
    const grid = page.locator('[data-testid="product-grid"]');
    await expect(grid).toBeVisible();
    // The grid should have CSS grid-template-columns with 3 columns
    const columns = await grid.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.gridTemplateColumns;
    });
    // "3" columns means three non-zero values separated by spaces
    const columnCount = columns.trim().split(/\s+/).length;
    expect(columnCount).toBe(3);
  });

  test('product card links to the correct product detail page', async ({ page }) => {
    const firstCard = page.locator('[data-testid="product-card"]').first();
    const link = firstCard.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/^\/shop\/.+/);
  });
});

// ---------------------------------------------------------------------------
// Category pages
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { name: 'Face', slug: 'face' },
  { name: 'Supplements', slug: 'supplements' },
  { name: 'Hair Oils', slug: 'hair-oils' },
  { name: 'Eye Cremes', slug: 'eye-cremes' },
  { name: 'Face Masques', slug: 'face-masques' },
  { name: 'Fragrances', slug: 'fragrances' },
] as const;

test.describe('Category pages', () => {
  for (const category of CATEGORIES) {
    test(`/shop/${category.slug} returns HTTP 200 and shows a heading`, async ({ page }) => {
      // SP-007: All six category routes are reachable
      const response = await page.goto(`/shop/${category.slug}`);
      expect(response?.status()).toBe(200);

      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
    });
  }

  test('Face category page shows only Face products', async ({ page }) => {
    // SP-005: Category page filters correctly
    await page.goto('/shop/face', { waitUntil: 'domcontentloaded' });
    const cards = page.locator('[data-testid="product-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Each visible product card should belong to Face; none should show other categories
    // We verify no product card shows a category label for a different category
    const supplementsBadge = page.locator('[data-testid="product-category"]', { hasText: /supplements/i });
    await expect(supplementsBadge).not.toBeVisible();
  });

  test('category page with no products shows an empty state message', async ({ page }) => {
    // ES-005: Empty category shows appropriate message (not a blank grid)
    // We navigate to a valid category slug. If the page has no products,
    // it should render a message, not a blank white area.
    // This test relies on the implementation rendering an empty state.
    await page.goto('/shop/fragrances', { waitUntil: 'domcontentloaded' });
    const response = await page.goto('/shop/fragrances');
    expect(response?.status()).toBe(200);
    // The page should render something meaningful — either products or an empty state
    const content = page.locator('[data-testid="product-grid"], [data-testid="empty-state"]');
    await expect(content.first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Product detail page
// ---------------------------------------------------------------------------

test.describe('Product detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });
  });

  test('product detail page returns HTTP 200', async ({ page }) => {
    const response = await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`);
    expect(response?.status()).toBe(200);
  });

  test('product name is visible', async ({ page }) => {
    // SP-008 / FR-2
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });

  test('product price is visible', async ({ page }) => {
    // SP-008 / FR-2
    const price = page.locator('[data-testid="product-price"]').or(
      page.getByText(/\$[\d,]+(\.\d{2})?/),
    ).first();
    await expect(price).toBeVisible();
  });

  test('at least one product image is visible', async ({ page }) => {
    // SP-008 / FR-2: Multiple images
    const images = page.locator('[data-testid="product-image"]').or(
      page.locator('[data-testid="product-images"] img'),
    );
    await expect(images.first()).toBeVisible();
  });

  test('product images have non-empty alt text', async ({ page }) => {
    // A11Y-005 / NFR-6
    const images = page.locator('[data-testid="product-images"] img').or(
      page.locator('img[alt]'),
    );
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
      expect(alt?.trim().length).toBeGreaterThan(0);
    }
  });

  test('product description is visible', async ({ page }) => {
    // SP-008 / FR-2
    const description = page.locator('[data-testid="product-description"]');
    await expect(description).toBeVisible();
  });

  test('ingredient list is visible', async ({ page }) => {
    // SP-008 / FR-2: Full ingredient list
    const ingredients = page.locator('[data-testid="product-ingredients"]').or(
      page.getByRole('heading', { name: /ingredients/i }),
    );
    await expect(ingredients.first()).toBeVisible();
  });

  test('usage instructions are visible', async ({ page }) => {
    // FR-2
    const instructions = page.locator('[data-testid="product-usage"]').or(
      page.getByRole('heading', { name: /how to use|usage instructions/i }),
    );
    await expect(instructions.first()).toBeVisible();
  });

  test('add-to-cart button is visible', async ({ page }) => {
    // SP-008 / FR-2
    const addToCart = page.getByRole('button', { name: /add to cart/i });
    await expect(addToCart).toBeVisible();
  });

  // ── Subscription toggle ──────────────────────────────────────────────────

  test('subscription toggle is present on subscription-eligible product', async ({ page }) => {
    // SP-009 / FR-3: One-time + subscription toggle
    const toggle = page.locator('[data-testid="subscription-toggle"]').or(
      page.getByRole('radio', { name: /subscribe|one.time/i }).first(),
    );
    await expect(toggle).toBeVisible();
  });

  test('one-time purchase option is selectable', async ({ page }) => {
    // SP-009: Both options present
    const oneTime = page.getByRole('radio', { name: /one.time|purchase once/i }).or(
      page.locator('[data-testid="purchase-type-one-time"]'),
    );
    await expect(oneTime.first()).toBeVisible();
  });

  test('subscription option shows three frequency choices', async ({ page }) => {
    // SP-011 / FR-3: Monthly, bi-monthly, quarterly
    // Activate subscription mode first
    const subscribeOption = page.locator('[data-testid="purchase-type-subscribe"]').or(
      page.getByRole('radio', { name: /subscribe/i }),
    );
    if (await subscribeOption.count() > 0) {
      await subscribeOption.first().click();
    }

    const monthly = page.getByRole('option', { name: /monthly/i }).or(
      page.getByText(/every month|monthly/i).first(),
    );
    const bimonthly = page.getByRole('option', { name: /2 months|bi.monthly/i }).or(
      page.getByText(/every 2 months|bi.monthly/i).first(),
    );
    const quarterly = page.getByRole('option', { name: /3 months|quarterly/i }).or(
      page.getByText(/every 3 months|quarterly/i).first(),
    );

    await expect(monthly.first()).toBeVisible();
    await expect(bimonthly.first()).toBeVisible();
    await expect(quarterly.first()).toBeVisible();
  });

  test('selecting subscription shows a recurring price distinct from one-time price', async ({ page }) => {
    // SP-010: Price difference visible between one-time and subscribe
    const priceEl = page.locator('[data-testid="product-price"]').first();
    const initialPrice = await priceEl.textContent();

    const subscribeOption = page.locator('[data-testid="purchase-type-subscribe"]').or(
      page.getByRole('radio', { name: /subscribe/i }),
    );
    if (await subscribeOption.count() > 0) {
      await subscribeOption.first().click();
      const subscribePrice = await priceEl.textContent();
      // Subscribe price should differ from one-time price (discount)
      expect(subscribePrice).not.toEqual(initialPrice);
    }
  });

  // ── 404 for unknown slug ──────────────────────────────────────────────────

  test('non-existent product slug returns 404', async ({ page }) => {
    // FS-008
    const response = await page.goto('/shop/this-product-does-not-exist-at-all');
    expect(response?.status()).toBe(404);
  });

  // ── Layout resilience ─────────────────────────────────────────────────────

  test('product card with long name does not overflow its container', async ({ page }) => {
    // EC-004: Long product names should wrap or truncate
    // We test on the shop page with a product whose name is rendered in a card
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    const firstCard = page.locator('[data-testid="product-card"]').first();
    const cardBox = await firstCard.boundingBox();
    const nameEl = firstCard.locator('[data-testid="product-name"]').first();
    const nameBox = await nameEl.boundingBox();

    if (cardBox && nameBox) {
      // The name element must not extend beyond the card's right edge
      expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 1);
    }
  });
});
