export function checkCanonical(canonical) {
  if (canonical.trim() === '') {
    return {
      id: 'canonical',
      name: 'Canonical URL',
      status: 'Failed',
      message: 'Canonical URL not found',
    };
  }
  else {
    return {
      id: 'canonical',
      name: 'Canonical URL',
      status: 'Passed',
      message: 'Canonical URL found',
    };
  }
}
