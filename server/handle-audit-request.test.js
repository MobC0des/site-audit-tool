import { afterEach, describe, expect, test, vi } from 'vitest';
import { handleAuditRequest } from './handle-audit-request.js';

describe('handleAuditRequest', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns 400 when URL is missing', async () => {
    const request = new Request(
      'http://localhost:3001/api/audit'
    );

    const response = await handleAuditRequest(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: 'URL is required'
    });
  });

  test('returns 400 when URL is invalid', async () => {
    const request = new Request(
      'http://localhost:3001/api/audit?url=invalid-url'
    );

    const response = await handleAuditRequest(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: 'Invalid URL'
    });
  });

  test('returns 400 when protocol is unsupported', async () => {
    const request = new Request(
      'http://localhost:3001/api/audit?url=ftp://example.com'
    );

    const response = await handleAuditRequest(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: 'URL must use HTTP or HTTPS'
    });
  });

  test('returns audit data for a valid URL', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      status: 200,
      url: 'https://example.com/',
      text: async () => `
        <html>
          <head>
            <title>Example page</title>
            <link rel="canonical" href="https://example.com/" />
          </head>
          <body>
            <h1>Example page</h1>
          </body>
        </html>
      `,
    });

    const request = new Request(
      'http://localhost:3001/api/audit?url=https://example.com'
    );

    const response = await handleAuditRequest(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requestedUrl).toBe('https://example.com');
    expect(body.finalUrl).toBe('https://example.com/');
    expect(body.status).toBe(200);
  });

});
