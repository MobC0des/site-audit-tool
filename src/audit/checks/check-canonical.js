export function checkCanonical(canonical, url) {
  if (canonical.trim() === '') {
    return {
      id: 'canonical',
      name: 'Canonical URL',
      status: 'Failed',
      message: 'Canonical URL not found',
    };
  }
  else if (canonical === url) {
    return {
      id: 'canonical',
      name: 'Canonical URL',
      status: 'Passed',
      message: 'Canonical URL matches',
    };
  }
  else {
    return {
      id: 'canonical',
      name: 'Canonical URL',
      status: 'Warning',
      message: 'Canonical URL does not match the page URL',
    };
  }
}
