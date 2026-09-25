import { describe, expect, test } from "vitest";
import { checkEmptyLinks } from "./check-empty-links";

describe('checkEmptyLinks', () => {
  test('should return passed when no empty links are found', () => {
    const links = [
      {
        text: 'Link 1',
        ariaLabel: 'Link 1'
      },
      {
        text: 'Link 2',
        ariaLabel: 'Link 2'
      },
    ];

    const result = checkEmptyLinks(links);

    expect(result.status).toBe('Passed');
  });

  test('should return failed when empty links are found', () => {
    const links = [
      {
        text: '',
        ariaLabel: null
      },
      {
        text: '',
        ariaLabel: ''
      },
    ];

    const result = checkEmptyLinks(links);

    expect(result.status).toBe('Failed');
  });

  test('should return passed when link text is empty but aria label is present', () => {
    const links = [
      {
        text: '',
        ariaLabel: 'Open navigation',
      },
    ];

    const result = checkEmptyLinks(links);

    expect(result.status).toBe('Passed');
  });
});
