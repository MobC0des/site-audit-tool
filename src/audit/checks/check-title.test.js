import { describe, expect, test } from 'vitest';
import { checkTitle } from './check-title';

describe('checkTitle', () => {
  test('should return passed status when title is not empty', () => {
    const result = checkTitle('My Title');

    expect(result.status).toBe('Passed');
  });

  test('should return failed status when title is empty', () => {
    const result = checkTitle('');

    expect(result.status).toBe('Failed');
  });

  test('should return failed when title contains only whitespace', () => {
    const result = checkTitle('   ');

    expect(result.status).toBe('Failed');
  });
});
