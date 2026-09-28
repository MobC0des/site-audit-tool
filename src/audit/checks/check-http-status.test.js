import { describe, expect, test } from "vitest";
import { checkHttpStatus } from "./check-http-status";

describe("checkHttpStatus", () => {
  test("returns success message for 200 status", () => {
    const result = checkHttpStatus(200);

    expect(result.status).toBe('Passed');
  });

  test("returns success message for 299 status", () => {
    const result = checkHttpStatus(299);

    expect(result.status).toBe('Passed');
  });

  test("returns warning message for 300 status", () => {
    const result = checkHttpStatus(300);

    expect(result.status).toBe('Warning');
  });

  test("returns warning message for 399 status", () => {
    const result = checkHttpStatus(399);

    expect(result.status).toBe('Warning');
  });

  test("returns failed message for 400 status", () => {
    const result = checkHttpStatus(400);

    expect(result.status).toBe('Failed');
  });

  test("returns failed message for 500 status", () => {
    const result = checkHttpStatus(500);

    expect(result.status).toBe('Failed');
  });

  test("returns failed message for 599 status", () => {
    const result = checkHttpStatus(599);

    expect(result.status).toBe('Failed');
  });

  test("returns failed message for unknown status", () => {
    const result = checkHttpStatus(600);

    expect(result.status).toBe('Failed');
  });
});
