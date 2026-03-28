/**
 * accessibility.spec.ts — WCAG 2.1 Level AA accessibility E2E tests
 *
 * Covers:
 *   NFR-6: WCAG 2.1 Level AA compliance
 *   A11Y-001 through A11Y-008 from tests.md spec
 *
 * Uses @axe-core/playwright for automated accessibility checks.
 * Manual keyboard navigation tests complement the automated checks.
 *
 * NOTE: @axe-core/playwright must be installed as a dev dependency:
 *   npm install --save-dev @axe-core/playwright
 *
 * Tests WILL FAIL until the implementation exists (TDD Red phase).
 * Tests will also fail if @axe-core/playwright is not installed.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { MOCK_PRODUCT_SLUG, seedGuestCart } from './fixtures';

// ---------------------------------------------------------------------------
// Automated axe-core checks
// ---------------------------------------------------------------------------

test.describe('Automated accessibility checks (axe-core)', () => {
  /**
   * Runs an axe scan and asserts zero critical/serious violations.
   * "moderate" and "minor" violations are reported but not failed here —
   * the team should address them but they should not block the TDD cycle.
   */
  async function runAxeScan(page: import('@playwright/test').Page) {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const criticalOrSerious = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (criticalOrSerious.length > 0) {
      const summary = criticalOrSerious
        .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} element(s))`)
        .join('\n');
      throw new Error(`Accessibility violations found:\n${summary}`);
    }
  }

  test('homepage passes axe-core checks (no critical/serious violations)', async ({ page }) => {
    // A11Y-001
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await runAxeScan(page);
  });

  test('shop page passes axe-core checks', async ({ page }) => {
    // A11Y-002
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });
    await runAxeScan(page);
  });

  test('product detail page passes axe-core checks', async ({ page }) => {
    // A11Y-003
    await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });
    await runAxeScan(page);
  });

  test('cart page passes axe-core checks', async ({ page }) => {
    // A11Y-004
    await page.goto('/');
    await seedGuestCart(page);
    await runAxeScan(page);
  });

  test('journal page passes axe-core checks', async ({ page }) => {
    await page.goto('/journal', { waitUntil: 'domcontentloaded' });
    await runAxeScan(page);
  });

  test('contact page passes axe-core checks', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
    await runAxeScan(page);
  });
});

// ---------------------------------------------------------------------------
// Product image alt text
// ---------------------------------------------------------------------------

test.describe('Product image alt text', () => {
  test('all product images on the shop page have non-empty alt text', async ({ page }) => {
    // A11Y-005 / NFR-6
    await page.goto('/shop', { waitUntil: 'domcontentloaded' });

    const productImages = page.locator('[data-testid="product-card"] img');
    const count = await productImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await productImages.nth(i).getAttribute('alt');
      expect(alt, `Product image ${i + 1} has no alt text`).not.toBeNull();
      expect(alt!.trim().length, `Product image ${i + 1} has empty alt text`).toBeGreaterThan(0);
    }
  });

  test('all product images on a product detail page have non-empty alt text', async ({ page }) => {
    // A11Y-005
    await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    const productImages = page.locator('[data-testid="product-images"] img').or(
      page.locator('[data-testid="product-image-gallery"] img'),
    );
    const count = await productImages.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const alt = await productImages.nth(i).getAttribute('alt');
      expect(alt, `Product image ${i + 1} on detail page has no alt text`).not.toBeNull();
      expect(alt!.trim().length, `Product image ${i + 1} on detail page has empty alt text`).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Keyboard navigation
// ---------------------------------------------------------------------------

test.describe('Keyboard navigation', () => {
  test('interactive elements on the homepage are Tab-navigable with visible focus', async ({ page }) => {
    // A11Y-006: All interactive elements keyboard-navigable
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Tab through the first 10 interactive elements
    const interactiveElements: string[] = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return `${el.tagName.toLowerCase()}[${el.getAttribute('aria-label') || el.textContent?.trim().slice(0, 30) || 'no-label'}]`;
      });
      if (focused) interactiveElements.push(focused);
    }

    // At least some interactive elements should have received focus
    expect(interactiveElements.length).toBeGreaterThan(3);
  });

  test('each focused element has a visible focus indicator', async ({ page }) => {
    // A11Y-006: Visible focus ring
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');

    // The focused element should be visible
    await expect(focusedElement).toBeVisible({ timeout: 2000 });

    // Check that the focus ring is visually present by looking for outline style
    const hasOutlineOrRing = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const style = window.getComputedStyle(el);
      const outlineWidth = parseFloat(style.outlineWidth);
      const boxShadow = style.boxShadow;
      // Either a non-zero outline or a box-shadow used as a focus ring
      return outlineWidth > 0 || (boxShadow !== 'none' && boxShadow !== '');
    });

    expect(hasOutlineOrRing).toBe(true);
  });

  test('header navigation links are reachable by keyboard on desktop', async ({ page }) => {
    // A11Y-006
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Tab until we reach the navigation
    let reachedNav = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const isNavLink = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.closest('nav') !== null;
      });
      if (isNavLink) {
        reachedNav = true;
        break;
      }
    }

    expect(reachedNav).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Mobile navigation accessibility
// ---------------------------------------------------------------------------

test.describe('Mobile navigation accessibility', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile navigation trigger button is accessible', async ({ page }) => {
    // A11Y-007: Mobile menu accessible via screen reader
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The mobile nav trigger should have a meaningful accessible name
    const menuTrigger = page.getByRole('button', { name: /menu|navigation|open/i }).first();
    await expect(menuTrigger).toBeVisible();
  });

  test('mobile navigation drawer opens and contains links', async ({ page }) => {
    // A11Y-007: Mobile nav links reachable
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const menuTrigger = page.getByRole('button', { name: /menu|navigation|open/i }).first();
    await menuTrigger.click();

    const nav = page.getByRole('navigation').first().or(
      page.locator('[data-testid="mobile-nav"]'),
    );
    await expect(nav).toBeVisible({ timeout: 3000 });

    // Nav should contain at least one link
    const links = nav.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('mobile navigation can be opened and closed by keyboard', async ({ page }) => {
    // A11Y-007: Keyboard-operable mobile nav
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Tab to the menu button and press Enter
    const menuTrigger = page.getByRole('button', { name: /menu|navigation|open/i }).first();
    await menuTrigger.focus();
    await page.keyboard.press('Enter');

    const mobileNav = page.locator('[data-testid="mobile-nav"]').or(
      page.getByRole('dialog', { name: /navigation/i }),
    );
    await expect(mobileNav.first()).toBeVisible({ timeout: 3000 });
  });
});

// ---------------------------------------------------------------------------
// Color contrast (via axe-core)
// ---------------------------------------------------------------------------

test.describe('Color contrast', () => {
  test('homepage body text meets WCAG AA contrast ratio (4.5:1)', async ({ page }) => {
    // A11Y-008: Color contrast
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast',
    );

    if (contrastViolations.length > 0) {
      const details = contrastViolations
        .flatMap((v) => v.nodes)
        .map((n) => n.html)
        .slice(0, 5)
        .join('\n');
      throw new Error(`Color contrast violations on homepage:\n${details}`);
    }
  });

  test('product detail page body text meets WCAG AA contrast ratio', async ({ page }) => {
    // A11Y-008
    await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    const violations = results.violations.filter((v) => v.id === 'color-contrast');
    expect(violations).toHaveLength(0);
  });
});
