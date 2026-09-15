export function checkPlaceholderLinks(links) {
  const placeholderLinks = links.filter((link) => {
    return link.href === '' ||
      link.href === '#' ||
      link.href === 'javascript:void(0)' ||
      link.href === null;

  });

  if (placeholderLinks.length > 0) {
    return {
      id: 'placeholder-links',
      name: 'Placeholder Links',
      status: 'Failed',
      message: `${placeholderLinks.length} placeholder link(s) found.`,
    };
  }
  return {
    id: 'placeholder-links',
    name: 'Placeholder Links',
    status: 'Passed',
    message: 'No placeholder links found.',
  };
}
