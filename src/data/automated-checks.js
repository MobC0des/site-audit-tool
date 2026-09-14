import { runPageAudit } from '../audit/run-page-audit.js';

const samplePage = {
  title: 'Example Website',
  canonical: 'https://example.com',
  url: 'https://example.com',
  headings: [
    { level: 1, text: 'Welcome' },
    { level: 2, text: 'Services' },
  ],
};

export const automatedChecks = runPageAudit(samplePage);
