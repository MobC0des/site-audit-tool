import { describe, expect, test } from "vitest";
import { checkPlaceholderContent } from "./check-placeholder-content";

describe("checkPlaceholderContent", () => {
  test("should return failed status when Lorem ipsum is found", () => {
    const result = checkPlaceholderContent("Lorem ipsum");

    expect(result.status).toBe("Failed");
  });

  test("should return failed status when TODO is found", () => {
    const result = checkPlaceholderContent("TODO");

    expect(result.status).toBe("Failed");
  });

  test("should return failed status when TBC is found", () => {
    const result = checkPlaceholderContent("TBC");

    expect(result.status).toBe("Failed");
  });

  test("should return failed status when Coming Soon is found", () => {
    const result = checkPlaceholderContent("Coming Soon");

    expect(result.status).toBe("Failed");
  });

  test("should return failed status when placeholder content uses different casing", () => {
    const result = checkPlaceholderContent("coming soon");

    expect(result.status).toBe("Failed");
  });

  test("should return passed status when no placeholder content is found", () => {
    const result = checkPlaceholderContent("No placeholder content");

    expect(result.status).toBe("Passed");
  });
});
