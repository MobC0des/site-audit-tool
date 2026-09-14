import { checkCanonical } from './checks/check-canonical.js';
import { checkH1 } from './checks/check-h1.js';
import { checkHttps } from './checks/check-https.js';
import { checkPerformance } from './checks/check-performance.js';
import { checkTitle } from './checks/check-title.js';


export function runPageAudit(page) {
  return [
    checkH1(page.headings),
    checkTitle(page.title),
    checkCanonical(page.canonical, page.url),
    checkHttps(page.url),
    checkPerformance(page.performanceScore),
  ];
}
