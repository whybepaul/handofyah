/**
 * fixtures.ts — Shared test fixtures, mock data, and helpers for Hand of Yah E2E tests
 *
 * All API calls to external services (Stripe, Supabase, Sanity, Listmonk) are
 * intercepted via page.route() so tests never require live credentials or
 * network access to third-party services.
 */

import type { Page } from '@playwright/test';
import { test as base } from '@playwright/test';

// ---------------------------------------------------------------------------
// Mock data shapes
// ---------------------------------------------------------------------------

export const MOCK_PRODUCT_SLUG = 'luminous-face-serum';
export const MOCK_PRODUCT_SLUG_2 = 'nourishing-hair-oil';
export const MOCK_JOURNAL_SLUG = 'the-ritual-of-morning-skincare';
export const MOCK_LEARN_SLUG = 'understanding-hyaluronic-acid';
export const MOCK_INGREDIENT_SLUG = 'rosehip-oil';
export const MOCK_STRIPE_SESSION_URL = 'https://checkout.stripe.com/c/pay/cs_test_mock123';
export const MOCK_STRIPE_SESSION_ID = 'cs_test_mock123';
export const MOCK_STRIPE_WEBHOOK_SECRET = 'whsec_test_mock';
export const MOCK_ORDER_ID = '550e8400-e29b-41d4-a716-446655440000';
export const MOCK_SUBSCRIPTION_ID = '660e8400-e29b-41d4-a716-446655440001';
export const MOCK_CUSTOMER_EMAIL = 'test@handofya.com';

export const MOCK_PRODUCT = {
  _id: 'product-1',
  _type: 'product',
  name: 'Luminous Face Serum',
  slug: { current: MOCK_PRODUCT_SLUG },
  price: 4800, // cents: $48.00
  description: [{ _type: 'block', children: [{ _type: 'span', text: 'A lightweight, fast-absorbing serum.' }] }],
  ingredients: [{ name: 'Rosehip Oil', slug: { current: 'rosehip-oil' } }],
  usageInstructions: [{ _type: 'block', children: [{ _type: 'span', text: 'Apply 3-4 drops to clean skin.' }] }],
  category: { name: 'Face', slug: { current: 'face' } },
  images: [{ _type: 'image', asset: { _ref: 'image-mock-1' } }],
  subscriptionEligible: true,
  status: 'active',
  seo: {
    metaTitle: 'Luminous Face Serum | Hand of Yah',
    metaDescription: 'A lightweight serum for glowing skin.',
  },
};

export const MOCK_PRODUCT_NO_SUBSCRIPTION = {
  ...MOCK_PRODUCT,
  _id: 'product-2',
  name: 'Nourishing Hair Oil',
  slug: { current: MOCK_PRODUCT_SLUG_2 },
  category: { name: 'Hair Oils', slug: { current: 'hair-oils' } },
  subscriptionEligible: false,
};

export const MOCK_PRODUCTS_LIST = [
  MOCK_PRODUCT,
  MOCK_PRODUCT_NO_SUBSCRIPTION,
  {
    ...MOCK_PRODUCT,
    _id: 'product-3',
    name: 'Brightening Eye Creme',
    slug: { current: 'brightening-eye-creme' },
    category: { name: 'Eye Cremes', slug: { current: 'eye-cremes' } },
  },
];

export const MOCK_JOURNAL_POST = {
  _id: 'post-1',
  _type: 'journalPost',
  title: 'The Ritual of Morning Skincare',
  slug: { current: MOCK_JOURNAL_SLUG },
  featuredImage: { _type: 'image', asset: { _ref: 'image-mock-post-1' } },
  body: [{ _type: 'block', children: [{ _type: 'span', text: 'Morning skincare is an act of intention.' }] }],
  excerpt: 'How to build a morning skincare ritual that grounds you for the day.',
  publishedAt: '2026-03-01T09:00:00Z',
  seo: {
    metaTitle: 'The Ritual of Morning Skincare | Hand of Yah Journal',
    metaDescription: 'How to build a morning skincare ritual.',
  },
};

export const MOCK_LEARN_ARTICLE = {
  _id: 'learn-1',
  _type: 'learnArticle',
  title: 'Understanding Hyaluronic Acid',
  slug: { current: MOCK_LEARN_SLUG },
  featuredImage: { _type: 'image', asset: { _ref: 'image-mock-learn-1' } },
  body: [{ _type: 'block', children: [{ _type: 'span', text: 'Hyaluronic acid is a humectant that attracts moisture.' }] }],
  seo: {
    metaTitle: 'Understanding Hyaluronic Acid | Hand of Yah Learn',
    metaDescription: 'What hyaluronic acid does for your skin.',
  },
};

export const MOCK_INGREDIENT = {
  _id: 'ingredient-1',
  _type: 'ingredient',
  name: 'Rosehip Oil',
  slug: { current: MOCK_INGREDIENT_SLUG },
  description: [{ _type: 'block', children: [{ _type: 'span', text: 'Cold-pressed from rosehip seeds.' }] }],
  benefits: ['Reduces fine lines', 'Brightens skin tone', 'Improves skin texture'],
};

export const MOCK_ORDER = {
  id: MOCK_ORDER_ID,
  customer_id: 'customer-1',
  stripe_payment_intent_id: 'pi_mock123',
  status: 'paid',
  subtotal: 4800,
  shipping: 500,
  tax: 360,
  total: 5660,
  shipping_address: {
    line1: '123 Main St',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    country: 'US',
  },
  line_items: [{ product_slug: MOCK_PRODUCT_SLUG, quantity: 1, unit_price: 4800 }],
  created_at: '2026-03-15T14:00:00Z',
};

export const MOCK_SUBSCRIPTION = {
  id: MOCK_SUBSCRIPTION_ID,
  customer_id: 'customer-1',
  stripe_subscription_id: 'sub_mock456',
  product_slug: MOCK_PRODUCT_SLUG,
  frequency: 'monthly',
  status: 'active',
  next_billing_date: '2026-04-15T14:00:00Z',
  created_at: '2026-03-15T14:00:00Z',
};

export const MOCK_WISHLIST_ITEMS = [
  { id: 'wl-1', product_slug: MOCK_PRODUCT_SLUG },
];

// ---------------------------------------------------------------------------
// Stripe mock helpers
// ---------------------------------------------------------------------------

/**
 * Intercepts POST /api/checkout and returns a mock Stripe checkout URL.
 * Prevents any live Stripe API calls during tests.
 */
export async function mockCheckoutApi(page: Page) {
  await page.route('**/api/checkout', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: MOCK_STRIPE_SESSION_URL, sessionId: MOCK_STRIPE_SESSION_ID }),
      });
    } else {
      await route.continue();
    }
  });
}

/**
 * Intercepts POST /api/checkout and returns a 500 error.
 * Used to test graceful error handling in the checkout flow.
 */
export async function mockCheckoutApiError(page: Page) {
  await page.route('**/api/checkout', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Stripe API unavailable' }),
    });
  });
}

// ---------------------------------------------------------------------------
// Supabase auth mock helpers
// ---------------------------------------------------------------------------

/**
 * Intercepts Supabase auth calls to simulate an authenticated session.
 * The auth token header pattern matches Supabase's GoTrue endpoint.
 */
export async function mockAuthenticatedSession(page: Page) {
  // Mock the Supabase session endpoint
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'customer-1',
        email: MOCK_CUSTOMER_EMAIL,
        role: 'authenticated',
      }),
    });
  });
}

/**
 * Intercepts Supabase magic link request (signInWithOtp).
 */
export async function mockMagicLinkRequest(page: Page) {
  await page.route('**/auth/v1/otp', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });
}

// ---------------------------------------------------------------------------
// Account API mock helpers
// ---------------------------------------------------------------------------

export async function mockOrdersApi(page: Page, orders = [MOCK_ORDER]) {
  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orders }),
    });
  });
}

export async function mockSubscriptionsApi(page: Page, subscriptions = [MOCK_SUBSCRIPTION]) {
  await page.route('**/api/subscriptions', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ subscriptions }),
      });
    } else {
      await route.continue();
    }
  });
}

export async function mockSubscriptionUpdateApi(page: Page) {
  await page.route('**/api/subscriptions/**', async (route) => {
    if (route.request().method() === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_SUBSCRIPTION, frequency: 'quarterly' }),
      });
    } else if (route.request().method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_SUBSCRIPTION, status: 'cancelled' }),
      });
    } else {
      await route.continue();
    }
  });
}

export async function mockWishlistApi(page: Page, items = MOCK_WISHLIST_ITEMS) {
  await page.route('**/api/wishlist', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items }),
      });
    } else if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'wl-new', product_slug: MOCK_PRODUCT_SLUG }),
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/wishlist/**', async (route) => {
    if (route.request().method() === 'DELETE') {
      await route.fulfill({ status: 204 });
    } else {
      await route.continue();
    }
  });
}

// ---------------------------------------------------------------------------
// Content API mock helpers
// ---------------------------------------------------------------------------

export async function mockNewsletterApi(page: Page) {
  await page.route('**/api/newsletter', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Subscribed successfully' }),
    });
  });
}

export async function mockNewsletterApiDuplicate(page: Page) {
  await page.route('**/api/newsletter', async (route) => {
    // Listmonk returns 409 for duplicate subscribers; our API should handle gracefully
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: "You're already subscribed" }),
    });
  });
}

export async function mockContactApi(page: Page) {
  await page.route('**/api/contact', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Message sent successfully' }),
    });
  });
}

// ---------------------------------------------------------------------------
// Cart state helpers
// ---------------------------------------------------------------------------

/**
 * Seeds localStorage with a guest cart item.
 * Must be called after navigation (localStorage is origin-scoped).
 */
export async function seedGuestCart(page: Page, slug = MOCK_PRODUCT_SLUG) {
  await page.evaluate((productSlug) => {
    const cart = {
      items: [
        {
          productSlug,
          name: 'Luminous Face Serum',
          price: 4800,
          quantity: 1,
          isSubscription: false,
        },
      ],
    };
    localStorage.setItem('handofya_cart', JSON.stringify(cart));
  }, slug);
  // Reload so the app picks up the seeded cart
  await page.reload();
}

export async function seedGuestCartWithSubscription(page: Page) {
  await page.evaluate(() => {
    const cart = {
      items: [
        {
          productSlug: 'luminous-face-serum',
          name: 'Luminous Face Serum',
          price: 4800,
          quantity: 1,
          isSubscription: true,
          frequency: 'monthly',
        },
      ],
    };
    localStorage.setItem('handofya_cart', JSON.stringify(cart));
  });
  await page.reload();
}

export async function seedGuestCartMixed(page: Page) {
  await page.evaluate(() => {
    const cart = {
      items: [
        {
          productSlug: 'luminous-face-serum',
          name: 'Luminous Face Serum',
          price: 4800,
          quantity: 1,
          isSubscription: true,
          frequency: 'monthly',
        },
        {
          productSlug: 'nourishing-hair-oil',
          name: 'Nourishing Hair Oil',
          price: 3600,
          quantity: 1,
          isSubscription: false,
        },
      ],
    };
    localStorage.setItem('handofya_cart', JSON.stringify(cart));
  });
  await page.reload();
}

// ---------------------------------------------------------------------------
// Custom test fixture extending Playwright base
// ---------------------------------------------------------------------------

type HandOfYahFixtures = {
  // Extend with custom fixture types here as needed
};

export const test = base.extend<HandOfYahFixtures>({});
export { expect } from '@playwright/test';
