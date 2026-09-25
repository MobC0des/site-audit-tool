import { describe, expect, test } from 'vitest';
import { checkPlaceholderLinks } from './check-placeholder-links';

describe('checkPlaceholderLinks', () => {
  test('passes when all links have valid href values', () => {
    const links = [
      {
        href: '/about',
      },
    ];
    const result = checkPlaceholderLinks(links);

    expect(result.status).toBe('Passed');
  });

  test('fails when a link has an empty href', () => {
    const links = [
      {
        href: '',
      },
    ];
    const result = checkPlaceholderLinks(links);

    expect(result.status).toBe('Failed');
  });

  test('fails when a link uses a hash placeholder', () => {
    const links = [
      {
        href: '#',
      },
    ];
    const result = checkPlaceholderLinks(links);

    expect(result.status).toBe('Failed');
  });

  test('fails when a link uses JavaScript[void]', () => {
    const links = [
      {
        href: 'javascript:void(0)',
      },
    ];
    const result = checkPlaceholderLinks(links);

    expect(result.status).toBe('Failed');
  });

  test('fails when a link href is null', () => {
    const links = [
      {
        href: null,
      },
    ];
    const result = checkPlaceholderLinks(links);

    expect(result.status).toBe('Failed');
  });
});
