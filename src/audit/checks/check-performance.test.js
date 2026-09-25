import { describe, expect, test } from "vitest";
import { checkPerformance } from "./check-performance";

describe("checkPerformance", () => {
  test("should return Passed for high performance score", () => {
    const result = checkPerformance(95);

    expect(result.status).toBe("Passed");
  });

  test("should return Warning for medium performance score", () => {
    const result = checkPerformance(75);

    expect(result.status).toBe("Warning");
  });

  test("should return Failed for low performance score", () => {
    const result = checkPerformance(40);

    expect(result.status).toBe("Failed");
  });

  test("should return Passed when performance score is exactly 90", () => {
    const result = checkPerformance(90);

    expect(result.status).toBe("Passed");
  });

  test("should return Warning when performance score is exactly 89", () => {
    const result = checkPerformance(89);

    expect(result.status).toBe("Warning");
  });

  test("should return Warning when performance score is exactly 50", () => {
    const result = checkPerformance(50);

    expect(result.status).toBe("Warning");
  });

  test("should return Failed when performance score is exactly 49", () => {
    const result = checkPerformance(49);

    expect(result.status).toBe("Failed");
  });

  test("should return Warning when performance score is undefined", () => {
    const result = checkPerformance(undefined);

    expect(result.status).toBe("Warning");
  });
});
