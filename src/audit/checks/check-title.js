export function checkTitle(title) {
  if (title.trim() === '') {
    return {
      id: 'meta-title',
      name: 'Meta title',
      status: 'Failed',
      message: 'Meta title not found',
    };
  }
  else {
    return {
      id: 'meta-title',
      name: 'Meta title',
      status: 'Passed',
      message: 'Meta title found',
    };
  }
}
