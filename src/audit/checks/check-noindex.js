export function checkNoIndex(robots) {
  const noIndex = robots.includes('noindex');
  if (noIndex) {
    return {
      id: 'noindex',
      name: 'noIndex',
      status: 'Failed',
      message: 'Page is set to noindex'
    };
  } else {
    return {
      id: 'noindex',
      name: 'noIndex',
      status: 'Passed',
      message: 'Page is indexable'
    };
  }
}
