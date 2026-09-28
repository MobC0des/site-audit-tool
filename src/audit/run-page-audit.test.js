import { describe, expect, test } from 'vitest';
import { runPageAudit } from './run-page-audit.js';

describe('runPageAudit', () => {
  const httpStatus = 200;
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

  test('returns a result for every configured check', () => {
    const results = runPageAudit(page, httpStatus);

    expect(results).toHaveLength(11);
  });

  test('passes the page URL to the HTTPS checker', () => {
    const results = runPageAudit(page, httpStatus);
    const httpsResult = results.find((result) => result.id === 'https');

    expect(httpsResult.status).toBe('Passed');
  });

  test('passes robots data to the noindex checker', () => {
    const results = runPageAudit(page, httpStatus);
    const noindexResult = results.find((result) => result.id === 'noindex');

    expect(noindexResult.status).toBe('Passed');
  });

  test('passes HTTP status to the HTTP status checker', () => {
    const results = runPageAudit(page, httpStatus);
    const httpStatusResult = results.find((result) => result.id === 'http-status');

    expect(httpStatusResult.status).toBe('Passed');
  });
});
