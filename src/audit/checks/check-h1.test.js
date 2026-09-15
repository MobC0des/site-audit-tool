import { expect, test } from 'vitest';
import { checkH1 } from './check-h1.js';

test('passes when there is exactly one H1', () => {
  const result = checkH1([
    { tag: 'h1', text: 'Hello' },
  ]);

  expect(result.status).toBe('Passed');
});
