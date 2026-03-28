/**
 * content.spec.ts — Journal, Learn hub, Ingredient database, and contact form tests
 *
 * Covers:
 *   US-7: Visitor reads journal posts
 *   US-8: Shopper explores ingredient database
 *   SP-028 through SP-036: Journal listing, journal post, learn hub, learn article,
 *                           ingredient database, ingredient search, contact form
 *   FS-006: Contact form missing fields shows validation errors
 *   FS-009: Non-existent journal slug returns 404
 *   INT-005: POST /api/revalidate triggers ISR revalidation
 *   INT-006: Sanity Studio at /studio loads without conflict
 *
 * Tests WILL FAIL until content pages are implemented (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import {
  MOCK_JOURNAL_SLUG,
  MOCK_LEARN_SLUG,
  MOCK_INGREDIENT_SLUG,
  mockContactApi,
} from './fixtures';

// ---------------------------------------------------------------------------
// Journal listing page
// ---------------------------------------------------------------------------

test.describe('Journal listing page (/journal)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/journal', { waitUntil: 'domcontentloaded' });
  });

  test('journal page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/journal');
    expect(response?.status()).toBe(200);
  });

  test('journal page has a visible heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('journal listing shows at least one post card', async ({ page }) => {
    // SP-028: Posts visible with image, date, title, excerpt
    const postCard = page.locator('[data-testid="journal-card"]').first();
    await expect(postCard).toBeVisible();
  });

  test('journal post card shows a title', async ({ page }) => {
    // SP-028
    const postCard = page.locator('[data-testid="journal-card"]').first();
    const title = postCard.getByRole('heading').or(
      postCard.locator('[data-testid="post-title"]'),
    ).first();
    await expect(title).toBeVisible();
  });

  test('journal post card shows a publication date', async ({ page }) => {
    // SP-028: Date visible
    const postCard = page.locator('[data-testid="journal-card"]').first();
    const date = postCard.locator('[data-testid="post-date"]').or(
      postCard.locator('time'),
    ).first();
    await expect(date).toBeVisible();
  });

  test('journal post card shows an excerpt', async ({ page }) => {
    // SP-028
    const postCard = page.locator('[data-testid="journal-card"]').first();
    const excerpt = postCard.locator('[data-testid="post-excerpt"]').or(
      postCard.locator('p').first(),
    );
    await expect(excerpt.first()).toBeVisible();
  });

  test('journal post card has a featured image', async ({ page }) => {
    // SP-028
    const postCard = page.locator('[data-testid="journal-card"]').first();
    const image = postCard.locator('img').first();
    await expect(image).toBeVisible();
  });

  test('journal post card links to the post detail page', async ({ page }) => {
    const postCard = page.locator('[data-testid="journal-card"]').first();
    const link = postCard.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\/journal\/.+/);
  });
});

// ---------------------------------------------------------------------------
// Journal post detail page
// ---------------------------------------------------------------------------

test.describe('Journal post detail page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/journal/${MOCK_JOURNAL_SLUG}`, { waitUntil: 'domcontentloaded' });
  });

  test('journal post page returns HTTP 200', async ({ page }) => {
    const response = await page.goto(`/journal/${MOCK_JOURNAL_SLUG}`);
    expect(response?.status()).toBe(200);
  });

  test('journal post shows a title heading', async ({ page }) => {
    // SP-029
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('journal post shows a publication date', async ({ page }) => {
    // SP-029
    const date = page.locator('time').or(page.locator('[data-testid="post-date"]')).first();
    await expect(date).toBeVisible();
  });

  test('journal post shows a featured image', async ({ page }) => {
    // SP-029
    const image = page.locator('[data-testid="featured-image"] img').or(
      page.locator('article img').first(),
    );
    await expect(image.first()).toBeVisible();
  });

  test('journal post renders body content', async ({ page }) => {
    // SP-029: Rich text body is rendered
    const body = page.locator('[data-testid="post-body"]').or(
      page.locator('article p').first(),
    );
    await expect(body.first()).toBeVisible();
  });

  test('non-existent journal post slug returns 404', async ({ page }) => {
    // FS-009
    const response = await page.goto('/journal/this-post-does-not-exist-at-all');
    expect(response?.status()).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Learn hub
// ---------------------------------------------------------------------------

test.describe('Learn hub (/learn)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/learn', { waitUntil: 'domcontentloaded' });
  });

  test('learn page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/learn');
    expect(response?.status()).toBe(200);
  });

  test('learn page has a visible heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('learn page displays at least one article', async ({ page }) => {
    // SP-030
    const article = page.locator('[data-testid="learn-card"]').or(
      page.locator('article').first(),
    );
    await expect(article.first()).toBeVisible();
  });

  test('learn article card shows a title', async ({ page }) => {
    // SP-030
    const articleCard = page.locator('[data-testid="learn-card"]').first();
    const title = articleCard.getByRole('heading').first();
    await expect(title).toBeVisible();
  });

  test('learn article card links to the article page', async ({ page }) => {
    const articleCard = page.locator('[data-testid="learn-card"]').first();
    const link = articleCard.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\/learn\/.+/);
  });
});

test.describe('Learn article page', () => {
  test('learn article page returns HTTP 200', async ({ page }) => {
    const response = await page.goto(`/learn/${MOCK_LEARN_SLUG}`);
    expect(response?.status()).toBe(200);
  });

  test('learn article shows a title heading', async ({ page }) => {
    // SP-031
    await page.goto(`/learn/${MOCK_LEARN_SLUG}`, { waitUntil: 'domcontentloaded' });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('learn article renders body content', async ({ page }) => {
    // SP-031
    await page.goto(`/learn/${MOCK_LEARN_SLUG}`, { waitUntil: 'domcontentloaded' });
    const body = page.locator('[data-testid="article-body"]').or(
      page.locator('article p').first(),
    );
    await expect(body.first()).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Ingredient database
// ---------------------------------------------------------------------------

test.describe('Ingredient database (/ingredients)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ingredients', { waitUntil: 'domcontentloaded' });
  });

  test('ingredients page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/ingredients');
    expect(response?.status()).toBe(200);
  });

  test('ingredients page has a visible heading', async ({ page }) => {
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('ingredient list shows at least one ingredient', async ({ page }) => {
    // SP-032
    const ingredient = page.locator('[data-testid="ingredient-item"]').first();
    await expect(ingredient).toBeVisible();
  });

  test('ingredients page has a search input', async ({ page }) => {
    // SP-033
    const searchInput = page.getByRole('searchbox').or(
      page.getByRole('textbox', { name: /search/i }),
    ).first();
    await expect(searchInput).toBeVisible();
  });

  test('ingredient search filters the list to matching items', async ({ page }) => {
    // SP-034
    const searchInput = page.getByRole('searchbox').or(
      page.getByRole('textbox', { name: /search/i }),
    ).first();

    const allItems = page.locator('[data-testid="ingredient-item"]');
    const totalBefore = await allItems.count();

    await searchInput.fill('Rosehip');
    await page.waitForTimeout(500); // Debounce

    const filteredItems = page.locator('[data-testid="ingredient-item"]');
    const totalAfter = await filteredItems.count();

    // Filtered count should be less than or equal to total (and > 0)
    expect(totalAfter).toBeLessThanOrEqual(totalBefore);
    expect(totalAfter).toBeGreaterThan(0);

    // All visible items should match the search term
    await expect(filteredItems.first().getByText(/rosehip/i)).toBeVisible();
  });

  test('ingredient item links to its detail page', async ({ page }) => {
    const item = page.locator('[data-testid="ingredient-item"]').first();
    const link = item.getByRole('link').first();
    const href = await link.getAttribute('href');
    expect(href).toMatch(/\/ingredients\/.+/);
  });
});

test.describe('Ingredient detail page', () => {
  test('ingredient detail page returns HTTP 200', async ({ page }) => {
    const response = await page.goto(`/ingredients/${MOCK_INGREDIENT_SLUG}`);
    expect(response?.status()).toBe(200);
  });

  test('ingredient detail page shows name and description', async ({ page }) => {
    await page.goto(`/ingredients/${MOCK_INGREDIENT_SLUG}`, { waitUntil: 'domcontentloaded' });
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    const description = page.locator('[data-testid="ingredient-description"]').or(
      page.locator('article p').first(),
    );
    await expect(description.first()).toBeVisible();
  });

  test('ingredient detail page links to products containing it', async ({ page }) => {
    await page.goto(`/ingredients/${MOCK_INGREDIENT_SLUG}`, { waitUntil: 'domcontentloaded' });
    // CS-6: Ingredient page links back to products
    const productSection = page.locator('[data-testid="ingredient-products"]').or(
      page.getByRole('heading', { name: /found in|products/i }),
    ).first();
    await expect(productSection).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('contact page returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/contact');
    expect(response?.status()).toBe(200);
  });

  test('contact form has name, email, and message fields', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /message/i }).or(
      page.locator('textarea'),
    ).first()).toBeVisible();
  });

  test('contact form has a submit button', async ({ page }) => {
    const submitBtn = page.getByRole('button', { name: /send|submit/i });
    await expect(submitBtn).toBeVisible();
  });

  test('valid contact form submission shows a success message', async ({ page }) => {
    // SP-035
    await mockContactApi(page);
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });

    await page.getByRole('textbox', { name: /name/i }).fill('Jane Doe');
    await page.getByRole('textbox', { name: /email/i }).fill('jane@example.com');
    await (page.locator('textarea').or(page.getByRole('textbox', { name: /message/i }))).first()
      .fill('Hello, I have a question about your products.');

    await page.getByRole('button', { name: /send|submit/i }).click();

    const success = page.getByText(/thank you|message sent|success/i);
    await expect(success).toBeVisible({ timeout: 5000 });
  });

  test('submitting empty form shows validation errors for required fields', async ({ page }) => {
    // FS-006
    await page.getByRole('button', { name: /send|submit/i }).click();

    // At least one validation error should be visible
    const error = page.locator('[role="alert"]').or(
      page.getByText(/required|please enter|invalid/i),
    ).first();
    await expect(error).toBeVisible({ timeout: 3000 });
  });

  test('submitting form with missing email shows a validation error', async ({ page }) => {
    // FS-006: Missing email field
    await page.getByRole('textbox', { name: /name/i }).fill('Jane Doe');
    // Intentionally skip email
    await (page.locator('textarea').or(page.getByRole('textbox', { name: /message/i }))).first()
      .fill('Hello.');

    await page.getByRole('button', { name: /send|submit/i }).click();

    const emailError = page.locator('[data-testid="email-error"]').or(
      page.getByText(/email.*required|valid email/i),
    ).first();
    await expect(emailError).toBeVisible({ timeout: 3000 });
  });
});

// ---------------------------------------------------------------------------
// Sanity webhook ISR revalidation (INT-005)
// ---------------------------------------------------------------------------

test.describe('Sanity webhook ISR revalidation', () => {
  test('POST /api/revalidate with correct secret returns 200', async ({ page }) => {
    // INT-005: Sanity webhook triggers ISR
    const response = await page.request.post('/api/revalidate', {
      headers: { 'x-revalidate-secret': process.env.SANITY_REVALIDATE_SECRET || 'test-secret' },
      data: { path: '/shop/luminous-face-serum', _type: 'product' },
    });
    expect(response.status()).toBe(200);
  });

  test('POST /api/revalidate without secret returns 401', async ({ page }) => {
    // INT-005 negative: Missing secret
    const response = await page.request.post('/api/revalidate', {
      data: { path: '/shop/luminous-face-serum', _type: 'product' },
    });
    expect(response.status()).toBe(401);
  });
});

// ---------------------------------------------------------------------------
// Sanity Studio route (INT-006)
// ---------------------------------------------------------------------------

test.describe('Sanity Studio at /studio', () => {
  test('Sanity Studio page does not return 404', async ({ page }) => {
    // INT-006: Studio loads without route conflict
    // We just verify this doesn't 404 — Studio itself requires auth
    const response = await page.goto('/studio');
    // Accept 200 (loaded) or 401/redirect (auth required) — but NOT 404
    expect(response?.status()).not.toBe(404);
  });

  test('navigating to /studio does not conflict with other app routes', async ({ page }) => {
    // INT-006: Studio is isolated; navigating away still works
    await page.goto('/studio', { waitUntil: 'domcontentloaded' });
    // Navigate to a known app route
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    const response = await page.goto('/shop');
    expect(response?.status()).toBe(200);
  });
});
