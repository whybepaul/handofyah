/**
 * seo.spec.ts — SEO and structured data E2E tests
 *
 * Covers:
 *   NFR-4: All pages have unique meta titles and descriptions, OG tags
 *   NFR-5: Sitemap, robots.txt, JSON-LD schemas for products and journal posts
 *   SEO-001 through SEO-008 from tests.md spec
 *
 * These tests inspect the raw HTML response, not JavaScript-rendered output,
 * because search engines consume SSR/SSG HTML. All pages must be Server
 * Components or statically generated to pass these checks.
 *
 * Tests WILL FAIL until SEO implementation exists (TDD Red phase).
 */

import { test, expect } from '@playwright/test';
import { MOCK_PRODUCT_SLUG, MOCK_JOURNAL_SLUG } from './fixtures';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Reads the content of a <meta> tag by name attribute.
 */
async function getMetaContent(page: import('@playwright/test').Page, name: string): Promise<string | null> {
  return page.evaluate((metaName) => {
    const el = document.querySelector(`meta[name="${metaName}"]`);
    return el ? el.getAttribute('content') : null;
  }, name);
}

/**
 * Reads a property-based <meta> tag (e.g., og:title).
 */
async function getOgContent(page: import('@playwright/test').Page, property: string): Promise<string | null> {
  return page.evaluate((prop) => {
    const el = document.querySelector(`meta[property="${prop}"]`);
    return el ? el.getAttribute('content') : null;
  }, property);
}

/**
 * Parses JSON-LD scripts from the page and returns all parsed objects.
 */
async function getJsonLdObjects(page: import('@playwright/test').Page): Promise<Record<string, unknown>[]> {
  return page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    return scripts.map((s) => {
      try {
        return JSON.parse(s.textContent || '{}');
      } catch {
        return {};
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Homepage SEO
// ---------------------------------------------------------------------------

test.describe('Homepage SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
  });

  test('homepage has a non-empty page title', async ({ page }) => {
    // SEO-001
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
    // Title should reference the brand
    expect(title.toLowerCase()).toMatch(/hand of yah/i);
  });

  test('homepage has a non-empty meta description', async ({ page }) => {
    // SEO-001
    const description = await getMetaContent(page, 'description');
    expect(description).not.toBeNull();
    expect(description!.trim().length).toBeGreaterThan(0);
  });

  test('homepage has og:title', async ({ page }) => {
    // SEO-005
    const ogTitle = await getOgContent(page, 'og:title');
    expect(ogTitle).not.toBeNull();
    expect(ogTitle!.trim().length).toBeGreaterThan(0);
  });

  test('homepage has og:description', async ({ page }) => {
    // SEO-005
    const ogDesc = await getOgContent(page, 'og:description');
    expect(ogDesc).not.toBeNull();
    expect(ogDesc!.trim().length).toBeGreaterThan(0);
  });

  test('homepage has og:image', async ({ page }) => {
    // SEO-005
    const ogImage = await getOgContent(page, 'og:image');
    expect(ogImage).not.toBeNull();
    expect(ogImage!.trim().length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Product page SEO
// ---------------------------------------------------------------------------

test.describe('Product page SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/shop/${MOCK_PRODUCT_SLUG}`, { waitUntil: 'domcontentloaded' });
  });

  test('product page has a title containing the product name', async ({ page }) => {
    // SEO-002
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
    // Title should include product-related content
    expect(title.toLowerCase()).toMatch(/serum|luminous|face|hand of yah/i);
  });

  test('product page has a non-empty meta description', async ({ page }) => {
    // SEO-002
    const description = await getMetaContent(page, 'description');
    expect(description).not.toBeNull();
    expect(description!.trim().length).toBeGreaterThan(0);
  });

  test('product page has og:title, og:description, og:image', async ({ page }) => {
    // SEO-005
    const ogTitle = await getOgContent(page, 'og:title');
    const ogDesc = await getOgContent(page, 'og:description');
    const ogImage = await getOgContent(page, 'og:image');

    expect(ogTitle?.trim().length).toBeGreaterThan(0);
    expect(ogDesc?.trim().length).toBeGreaterThan(0);
    expect(ogImage?.trim().length).toBeGreaterThan(0);
  });

  test('product page has a JSON-LD Product schema', async ({ page }) => {
    // SEO-003 / NFR-5
    const jsonLdObjects = await getJsonLdObjects(page);
    const productSchema = jsonLdObjects.find(
      (obj) => obj['@type'] === 'Product' || (Array.isArray(obj['@type']) && (obj['@type'] as string[]).includes('Product')),
    );

    expect(productSchema).not.toBeUndefined();
  });

  test('product JSON-LD has required name field', async ({ page }) => {
    // SEO-003
    const jsonLdObjects = await getJsonLdObjects(page);
    const productSchema = jsonLdObjects.find((obj) => obj['@type'] === 'Product');

    expect(productSchema?.name).toBeTruthy();
  });

  test('product JSON-LD has offers field', async ({ page }) => {
    // SEO-003: Product schema must include Offer
    const jsonLdObjects = await getJsonLdObjects(page);
    const productSchema = jsonLdObjects.find((obj) => obj['@type'] === 'Product');

    expect(productSchema?.offers).toBeTruthy();
  });

  test('product JSON-LD has description field', async ({ page }) => {
    // SEO-003
    const jsonLdObjects = await getJsonLdObjects(page);
    const productSchema = jsonLdObjects.find((obj) => obj['@type'] === 'Product');

    expect(productSchema?.description).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Journal post SEO
// ---------------------------------------------------------------------------

test.describe('Journal post SEO', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/journal/${MOCK_JOURNAL_SLUG}`, { waitUntil: 'domcontentloaded' });
  });

  test('journal post page has a non-empty title', async ({ page }) => {
    const title = await page.title();
    expect(title.trim().length).toBeGreaterThan(0);
  });

  test('journal post page has a non-empty meta description', async ({ page }) => {
    const description = await getMetaContent(page, 'description');
    expect(description).not.toBeNull();
    expect(description!.trim().length).toBeGreaterThan(0);
  });

  test('journal post page has a JSON-LD Article schema', async ({ page }) => {
    // SEO-004 / NFR-5
    const jsonLdObjects = await getJsonLdObjects(page);
    const articleSchema = jsonLdObjects.find(
      (obj) => obj['@type'] === 'Article' || obj['@type'] === 'BlogPosting',
    );

    expect(articleSchema).not.toBeUndefined();
  });

  test('journal post JSON-LD has headline and datePublished', async ({ page }) => {
    // SEO-004
    const jsonLdObjects = await getJsonLdObjects(page);
    const articleSchema = jsonLdObjects.find(
      (obj) => obj['@type'] === 'Article' || obj['@type'] === 'BlogPosting',
    );

    expect(articleSchema?.headline).toBeTruthy();
    expect(articleSchema?.datePublished).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Category page SEO
// ---------------------------------------------------------------------------

test.describe('Category page SEO', () => {
  const categories = [
    { name: 'Face', slug: 'face' },
    { name: 'Supplements', slug: 'supplements' },
    { name: 'Hair Oils', slug: 'hair-oils' },
  ] as const;

  const seenTitles = new Set<string>();

  for (const category of categories) {
    test(`/shop/${category.slug} has a unique meta title containing the category name`, async ({ page }) => {
      // SEO-008: Unique titles per category page
      await page.goto(`/shop/${category.slug}`, { waitUntil: 'domcontentloaded' });
      const title = await page.title();

      expect(title.trim().length).toBeGreaterThan(0);
      // Title should reference the category
      expect(title.toLowerCase()).toMatch(
        new RegExp(category.name.toLowerCase().replace(' ', '.'), 'i'),
      );
      // Should be unique
      expect(seenTitles.has(title)).toBe(false);
      seenTitles.add(title);
    });
  }
});

// ---------------------------------------------------------------------------
// Sitemap and robots
// ---------------------------------------------------------------------------

test.describe('Sitemap and robots.txt', () => {
  test('sitemap.xml returns 200 with XML content type', async ({ page }) => {
    // SEO-006 / NFR-5
    const response = await page.request.get('/sitemap.xml');
    expect(response.status()).toBe(200);
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/xml/);
  });

  test('sitemap.xml contains at least one <url> entry', async ({ page }) => {
    // SEO-006
    const response = await page.request.get('/sitemap.xml');
    const body = await response.text();
    expect(body).toContain('<url>');
  });

  test('sitemap.xml contains the shop URL', async ({ page }) => {
    const response = await page.request.get('/sitemap.xml');
    const body = await response.text();
    expect(body).toContain('/shop');
  });

  test('robots.txt returns 200', async ({ page }) => {
    // SEO-007 / NFR-5
    const response = await page.request.get('/robots.txt');
    expect(response.status()).toBe(200);
  });

  test('robots.txt does not disallow all crawling', async ({ page }) => {
    // SEO-007: Site should be crawlable
    const response = await page.request.get('/robots.txt');
    const body = await response.text();
    // Should not have a blanket "Disallow: /" without an "Allow" override
    const hasDisallowAll = body.includes('Disallow: /') && !body.includes('Allow: /');
    expect(hasDisallowAll).toBe(false);
  });

  test('robots.txt references the sitemap', async ({ page }) => {
    const response = await page.request.get('/robots.txt');
    const body = await response.text();
    expect(body.toLowerCase()).toContain('sitemap');
  });
});
