import { handleAuditRequest } from './handle-audit-request.js';

const server = Bun.serve({
  port: 3001,
  fetch: handleAuditRequest,
});

console.log(
  `LaunchCheck server running at http://localhost:${server.port}`,
);
