export function collectPageData(_page) {
  const title = document.title;
  const url = window.location.href;

  const canonicalElement = document.querySelector('link[rel="canonical"]');

  let canonical = '';
  if (canonicalElement) {
    canonical = canonicalElement.href;
  }

  const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

  const headings = [...headingElements].map((heading) => {
    return {
      level: Number(heading.tagName.substring(1)),
      text: heading.textContent.trim(),
    };
  });

  return {
    title,
    url,
    canonical,
    headings
  };
}
