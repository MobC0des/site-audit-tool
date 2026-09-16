import { expect, test } from "vitest";
import { checkCanonical } from "./check-canonical.js";

test("fails when canonical is missing", () => {
  const result = checkCanonical(
    '',
    'https://example.com',
  );

  expect(result.status).toBe("Failed");
});

test("passes when canonical matches the page URL", () => {
  const result = checkCanonical(
    'https://example.com',
    'https://example.com',
  );

  expect(result.status).toBe("Passed");
});

test("warns when canonical does not match the page URL", () => {
  const result = checkCanonical(
    'https://example.com',
    'https://example.com/other-page',
  );

  expect(result.status).toBe("Warning");
});
