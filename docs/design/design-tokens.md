# Hand of Yah — Design Tokens

## CSS Custom Properties

```css
:root {
  /* Colors — Primary */
  --color-parchment: #F5F0E8;
  --color-umber: #2C2420;
  --color-terracotta: #C4704B;

  /* Colors — Secondary */
  --color-sage: #8B9A7E;
  --color-stone: #E8E2D8;
  --color-taupe: #B8AFA6;
  --color-espresso: #1A1614;

  /* Colors — Extended */
  --color-amber: #D4A574;
  --color-linen: #FAF7F2;
  --color-clay: #A85E3A;

  /* Typography — Families */
  --font-display: 'Cormorant Garamond', 'Georgia', serif;
  --font-body: 'Outfit', 'Helvetica Neue', sans-serif;

  /* Typography — Scale */
  --text-display-xl: 4.5rem;
  --text-display-lg: 3rem;
  --text-display-md: 2.25rem;
  --text-display-sm: 1.5rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-label: 0.75rem;
  --text-nav: 0.875rem;
  --text-price: 1.25rem;
  --text-button: 0.875rem;

  /* Typography — Line Heights */
  --leading-display-xl: 1.0;
  --leading-display-lg: 1.1;
  --leading-display-md: 1.15;
  --leading-display-sm: 1.2;
  --leading-body: 1.7;
  --leading-body-sm: 1.6;
  --leading-label: 1.4;
  --leading-tight: 1.0;

  /* Typography — Letter Spacing */
  --tracking-tight: -0.02em;
  --tracking-normal: 0;
  --tracking-wide: 0.04em;
  --tracking-wider: 0.06em;
  --tracking-widest: 0.08em;
  --tracking-wordmark: 0.15em;

  /* Spacing (8px grid) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Layout */
  --max-width: 1280px;
  --gutter: 1.5rem;
  --gutter-tablet: 1.25rem;
  --gutter-mobile: 1rem;
  --side-padding: 2.5rem;
  --side-padding-mobile: 1.25rem;

  /* Transitions */
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-entrance: cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 200ms;
  --duration-standard: 300ms;
  --duration-entrance: 600ms;
  --duration-page: 400ms;
  --stagger-delay: 80ms;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(44, 36, 32, 0.06);
  --shadow-md: 0 4px 12px rgba(44, 36, 32, 0.08);
  --shadow-lg: 0 8px 24px rgba(44, 36, 32, 0.1);
  --shadow-header: 0 1px 0 rgba(44, 36, 32, 0.06);

  /* Border */
  --border-color: rgba(44, 36, 32, 0.12);
  --border-width: 1px;
}
```

## Tailwind Config Extension

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0E8',
        umber: '#2C2420',
        terracotta: '#C4704B',
        sage: '#8B9A7E',
        stone: '#E8E2D8',
        taupe: '#B8AFA6',
        espresso: '#1A1614',
        amber: '#D4A574',
        linen: '#FAF7F2',
        clay: '#A85E3A',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Outfit', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-md': ['2.25rem', { lineHeight: '1.15' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        'nav': ['0.875rem', { lineHeight: '1', letterSpacing: '0.06em' }],
        'price': ['1.25rem', { lineHeight: '1', letterSpacing: '0.02em' }],
        'button': ['0.875rem', { lineHeight: '1', letterSpacing: '0.04em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '1280px',
        'prose': '65ch',
      },
      transitionTimingFunction: {
        'entrance': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(44, 36, 32, 0.08)',
        'card-hover': '0 8px 24px rgba(44, 36, 32, 0.1)',
        'header': '0 1px 0 rgba(44, 36, 32, 0.06)',
      },
    },
  },
}
```

## Global Component Classes

```css
/* globals.css */
@layer components {
  .btn-primary {
    @apply bg-terracotta text-parchment font-body text-button font-medium
           uppercase tracking-wide px-8 py-4
           transition-colors duration-300 ease-entrance
           hover:bg-clay active:bg-clay;
  }

  .btn-secondary {
    @apply bg-transparent text-umber border border-umber font-body text-button
           font-medium uppercase tracking-wide px-8 py-4
           transition-colors duration-300 ease-entrance
           hover:bg-stone active:bg-stone;
  }

  .btn-text {
    @apply text-umber font-body text-button font-medium
           relative inline-block
           after:absolute after:bottom-0 after:left-0
           after:w-0 after:h-px after:bg-terracotta
           after:transition-all after:duration-300
           hover:after:w-full;
  }

  .card-product {
    @apply bg-stone transition-all duration-300 ease-entrance
           hover:-translate-y-0.5 hover:shadow-card;
  }

  .input-field {
    @apply w-full bg-transparent border-0 border-b border-umber/20
           font-body text-body text-umber py-3
           placeholder:text-taupe
           focus:border-terracotta focus:outline-none
           transition-colors duration-200;
  }

  .section-padding {
    @apply py-12 md:py-16 lg:py-20;
  }

  .container-content {
    @apply max-w-content mx-auto px-5 md:px-10;
  }

  .prose-content {
    @apply max-w-prose mx-auto;
  }

  .label-text {
    @apply font-body text-label font-semibold uppercase tracking-widest text-taupe;
  }

  .heading-display {
    @apply font-display text-umber;
  }

  .wordmark {
    @apply font-display font-normal uppercase tracking-[0.15em] text-umber;
  }
}
```
