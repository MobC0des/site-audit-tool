import * as cheerio from 'cheerio';

export function collectPageData(html, url) {
  const $ = cheerio.load(html);

  const title = $('title').first().text().trim();

  const canonicalHref = $('link[rel="canonical"]').attr('href');

  let canonical = '';
  if (canonicalHref) {
    try {
      canonical = new URL(canonicalHref, url).href;
    } catch {
      canonical = canonicalHref;
    }
  }

  const headings = $('h1, h2, h3, h4, h5, h6')
    .toArray()
    .map((heading) => {
      return {
        tag: heading.tagName.toLowerCase(),
        text: $(heading).text().trim(),
      };
    });

  const body = $('body').clone();

  body
    .find('script, style, noscript, template')
    .remove();

  const pageText = body
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  const links = $('a')
    .toArray()
    .map((link) => {
      return {
        text: $(link).text().trim(),
        href: $(link).attr('href') ?? null,
        ariaLabel: $(link).attr('aria-label') ?? null,
      };
    });

  const robots = $('meta[name="robots"]').attr('content') ?? '';

  const images = $('img')
    .toArray()
    .map((img) => {
      return {
        src: $(img).attr('src') ?? null,
        alt: $(img).attr('alt') ?? null,
      };
    });

  return {
    title,
    url,
    canonical,
    headings,
    links,
    robots,
    images,
    pageText,
  };
}
