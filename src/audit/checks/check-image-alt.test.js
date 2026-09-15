import { expect, test } from 'vitest';
import { checkImageAlt } from './check-image-alt.js';

test('warns when an image has empty alt text', () => {
  const result = checkImageAlt([
    { src: '/image.jpg', alt: '' },
  ]);

  expect(result.status).toBe('Warning');
});
