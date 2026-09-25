export function checkNoIndex(robots) {
  const normalisedRobots = robots.toLowerCase();
  const noIndex = normalisedRobots.includes('noindex');

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
