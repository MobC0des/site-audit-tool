import { describe, expect, test } from 'vitest';
import { checkNoIndex } from './check-noindex';

describe('checkNoIndex', () => {
  test('should return failed when robots contains noindex', () => {
    const result = checkNoIndex('noindex');

    expect(result.status).toBe('Failed');
  });

  test('should return passed when robots does not contain noindex', () => {
    const result = checkNoIndex('');

    expect(result.status).toBe('Passed');
  });

  test('should return failed when robots contains noindex with other directives', () => {
    const result = checkNoIndex('noindex, follow');

    expect(result.status).toBe('Failed');
  });

  test('should return failed when noindex uses different casing', () => {
    const result = checkNoIndex('NOINDEX, FOLLOW');

    expect(result.status).toBe('Failed');
  });
});
