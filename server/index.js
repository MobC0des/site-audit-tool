import { runPageAudit } from '../src/audit/run-page-audit.js';
import { collectPageData } from './collect-page-data.js';

const server = Bun.serve({
  port: 3001,

  async fetch(request) {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname !== '/api/audit') {
      return new Response('Not found', {
        status: 404,
      });
    }

    const targetUrl = requestUrl.searchParams.get('url');

    if (!targetUrl) {
      return Response.json(
        {
          error: 'URL is required',
        },
        {
          status: 400,
        },
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return Response.json(
        {
          error: 'Invalid URL',
        },
        {
          status: 400,
        },
      );
    }

    if (
      parsedUrl.protocol !== 'http:' &&
      parsedUrl.protocol !== 'https:'
    ) {
      return Response.json(
        {
          error: 'URL must use HTTP or HTTPS',
        },
        {
          status: 400,
        },
      );
    }

    try {
      const response = await fetch(parsedUrl);

      const html = await response.text();
      const pageData = collectPageData(html, response.url);
      const auditResults = runPageAudit(pageData);

      const { pageText, ...publicPageData } = pageData;

      return Response.json({
        requestedUrl: targetUrl,
        finalUrl: response.url,
        status: response.status,
        pageData: publicPageData,
        auditResults,
      });
    } catch {
      return Response.json(
        {
          error: 'Unable to fetch website',
        },
        {
          status: 500,
        },
      );
    }
  },
});

console.log(
  `LaunchCheck server running at http://localhost:${server.port}`,
);
