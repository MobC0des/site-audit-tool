import { describe, expect, test } from "vitest";
import { checkHttps } from "./check-https";

describe("checkHttps", () => {
  test("should return Passed for HTTPS URL", () => {
    const result = checkHttps("https://example.com");

    expect(result.status).toBe("Passed");
  });

  test("should return Failed for HTTP URL", () => {
    const result = checkHttps("http://example.com");

    expect(result.status).toBe("Failed");
  });
});
