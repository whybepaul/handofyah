/**
 * homepage.spec.ts — Homepage E2E tests
 *
 * Covers:
 *   US-1: Visitor lands on homepage communicating premium quality
 *   SP-001 through SP-002: Homepage sections and hero CTA
 *   SP-036: Newsletter signup
 *   SP-037: Footer navigation
 *
 * API calls are intercepted via page.route() so no live backend is required.
 * Tests WILL FAIL until the homepage implementation exists (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import { mockNewsletterApi, mockNewsletterApiDuplicate } from './fixtures';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  // ── Page availability ─────────────────────────────────────────────────────

  test('homepage returns HTTP 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('no uncaught JavaScript errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('/', { waitUntil: 'networkidle' });
    const critical = errors.filter(
      (msg) => !msg.toLowerCase().includes('hydration'),
    );
    expect(critical).toHaveLength(0);
  });

  // ── Header / branding ─────────────────────────────────────────────────────

  test('Hand of Yah wordmark or logo is visible in the header', async ({ page }) => {
    const logo = page.getByRole('link', { name: /hand of yah/i }).first();
    await expect(logo).toBeVisible();
  });

  test('header navigation contains Shop link', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: /shop/i })).toBeVisible();
  });

  test('header navigation contains Journal link', async ({ page }) => {
    const nav = page.getByRole('navigation').first();
    await expect(nav.getByRole('link', { name: /journal/i })).toBeVisible();
  });

  test('header navigation contains a cart indicator', async ({ page }) => {
    // Cart icon/button should be in the header
    const cartButton = page.getByRole('button', { name: /cart/i }).or(
      page.getByRole('link', { name: /cart/i }),
    ).first();
    await expect(cartButton).toBeVisible();
  });

  // ── Hero section ──────────────────────────────────────────────────────────

  test('hero section is visible', async ({ page }) => {
    // Hero is the first major section of the page
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('hero section contains a link to /shop', async ({ page }) => {
    // SP-002: Hero must have a shop entry point
    const shopCta = page.getByRole('link', { name: /shop/i }).first();
    await expect(shopCta).toBeVisible();
    await expect(shopCta).toHaveAttribute('href', /\/shop/);
  });

  // ── Featured products section ─────────────────────────────────────────────

  test('featured products section is present', async ({ page }) => {
    // Homepage shows a curated grid of featured products (SP-001)
    // Look for a section heading that references products
    const productSection = page.getByRole('heading', { name: /featured|products/i }).first();
    await expect(productSection).toBeVisible();
  });

  test('featured products section shows at least one product card', async ({ page }) => {
    // Product cards should contain a name and price
    // We target any element with role=article or a known product card pattern
    const productCards = page.locator('[data-testid="product-card"]').or(
      page.locator('article').filter({ has: page.locator('[data-testid="product-price"]') }),
    );
    await expect(productCards.first()).toBeVisible();
  });

  // ── Journal preview section ───────────────────────────────────────────────

  test('journal preview section is visible', async ({ page }) => {
    // SP-001: Homepage shows journal preview
    const journalSection = page.getByRole('heading', { name: /journal/i }).first();
    await expect(journalSection).toBeVisible();
  });

  test('journal preview links to /journal', async ({ page }) => {
    const journalLink = page.getByRole('link', { name: /journal/i }).first();
    await expect(journalLink).toHaveAttribute('href', /\/journal/);
  });

  // ── Newsletter signup ─────────────────────────────────────────────────────

  test('newsletter signup form is present on homepage', async ({ page }) => {
    // SP-036 / FR-19 / INT-3a: Newsletter signup on homepage
    const emailInput = page.getByRole('textbox', { name: /email/i }).last();
    await expect(emailInput).toBeVisible();
  });

  test('newsletter form shows success message on valid email submission', async ({ page }) => {
    await mockNewsletterApi(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByRole('textbox', { name: /email/i }).last();
    await emailInput.fill('newsubscriber@example.com');
    await page.getByRole('button', { name: /subscribe|sign up/i }).last().click();

    await expect(page.getByText(/subscribed|thank you|success/i)).toBeVisible({ timeout: 5000 });
  });

  test('newsletter form shows graceful message for already-subscribed email', async ({ page }) => {
    await mockNewsletterApiDuplicate(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const emailInput = page.getByRole('textbox', { name: /email/i }).last();
    await emailInput.fill('existing@example.com');
    await page.getByRole('button', { name: /subscribe|sign up/i }).last().click();

    // Should not show an error crash — either "already subscribed" or generic success
    await expect(page.getByText(/subscribed|already|success/i)).toBeVisible({ timeout: 5000 });
  });

  // ── Footer ────────────────────────────────────────────────────────────────

  test('footer is visible', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('footer contains a link to /faq', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /faq/i })).toBeVisible();
  });

  test('footer contains a link to /shipping-returns', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /shipping/i })).toBeVisible();
  });

  test('footer contains a link to /terms', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /terms/i })).toBeVisible();
  });

  test('footer contains a link to /privacy', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /privacy/i })).toBeVisible();
  });

  test('footer contains social media links', async ({ page }) => {
    const footer = page.locator('footer');
    // At least one social link (Instagram is primary for the brand)
    const socialLink = footer.getByRole('link', { name: /instagram|facebook|twitter/i }).first();
    await expect(socialLink).toBeVisible();
  });

  // ── Meta / SEO (SP level) ─────────────────────────────────────────────────

  test('homepage has a non-empty page title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('homepage meta description is present', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });
});
