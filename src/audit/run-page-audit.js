import { checkCanonical } from './checks/check-canonical.js';
import { checkEmptyLinks } from './checks/check-empty-links.js';
import { checkH1 } from './checks/check-h1.js';
import { checkHttps } from './checks/check-https.js';
import { checkImageAlt } from './checks/check-image-alt.js';
import { checkNoIndex } from './checks/check-noindex.js';
import { checkPerformance } from './checks/check-performance.js';
import { checkPlaceholderContent } from './checks/check-placeholder-content.js';
import { checkPlaceholderLinks } from './checks/check-placeholder-links.js';
import { checkTitle } from './checks/check-title.js';



export function runPageAudit(page) {
  return [
    checkH1(page.headings),
    checkTitle(page.title),
    checkCanonical(page.canonical, page.url),
    checkHttps(page.url),
    checkPerformance(page.performanceScore),
    checkPlaceholderLinks(page.links),
    checkNoIndex(page.robots),
    checkImageAlt(page.images),
    checkEmptyLinks(page.links),
    checkPlaceholderContent(page.pageText),
  ];
}
