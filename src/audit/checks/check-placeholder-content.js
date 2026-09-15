export function checkPlaceholderContent(pageText) {
  const placeholderWords = [
    'Lorem ipsum',
    'TODO',
    'TBC',
    'Coming soon',
  ];

  const lowerCasePageText = pageText.toLowerCase();

  const hasPlaceholderContent = placeholderWords.some((word) =>
    lowerCasePageText.includes(word.toLowerCase()),
  );

  if (hasPlaceholderContent) {
    return {
      id: 'placeholder-content',
      name: 'Placeholder Content',
      status: 'Failed',
      message: 'Placeholder content found on the page.',
    };
  } else {
    return {
      id: 'placeholder-content',
      name: 'Placeholder Content',
      status: 'Passed',
      message: 'No placeholder content found on the page.',
    };
  }
}
