export function collectPageData() {
  const title = document.title;
  const url = window.location.href;

  const canonicalElement = document.querySelector(
    'link[rel="canonical"]',
  );

  let canonical = '';

  if (canonicalElement) {
    canonical = canonicalElement.href;
  }

  const headingElements = document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6',
  );

  const headings = [...headingElements].map((heading) => {
    return {
      tag: heading.tagName.toLowerCase(),
      text: heading.textContent.trim(),
    };
  });

  const pageText = document.body.textContent.trim();

  const linkElements = document.querySelectorAll('a');

  const links = [...linkElements].map((link) => {
    return {
      text: link.textContent.trim(),
      href: link.getAttribute('href'),
      ariaLabel: link.getAttribute('aria-label'),
    };
  });

  const robotsElement = document.querySelector(
    'meta[name="robots"]',
  );

  const robots = robotsElement
    ? robotsElement.getAttribute('content')
    : '';

  const imageElements = document.querySelectorAll('img');

  const images = [...imageElements].map((img) => {
    return {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt'),
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
