import { describe, expect, test } from 'vitest';
import { runPageAudit } from './run-page-audit.js';

describe('runPageAudit', () => {
  test('returns a result for every configured check', () => {
    const page = {
      title: 'Example page',
      url: 'https://example.com',
      canonical: 'https://example.com',
      headings: [
        {
          tag: 'h1',
          text: 'Example page',
        },
      ],
      links: [
        {
          text: 'About',
          href: '/about',
          ariaLabel: null,
        },
      ],
      robots: 'index, follow',
      images: [
        {
          src: '/image.jpg',
          alt: 'Example image',
        },
      ],
      pageText: 'This is normal page content.',
      performanceScore: 95,
    };

    const results = runPageAudit(page);

    expect(results).toHaveLength(10);
  });
});
