export function checkEmptyLinks(links) {
  const emptyLinks = links.filter((link) => {
    return (
      link.text === '' &&
      (link.ariaLabel === null || link.ariaLabel === '')
    );
  });

  if (emptyLinks.length > 0) {
    return {
      id: 'empty-links',
      name: 'Empty Links',
      status: 'Failed',
      message: `${emptyLinks.length} empty link(s) found.`,
    };
  }
  return {
    id: 'empty-links',
    name: 'Empty Links',
    status: 'Passed',
    message: 'No empty links found.',
  };
}
