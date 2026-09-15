export function checkH1(headings) {
  const h1Headings = headings.filter(
    (heading) => heading.tag === 'h1',
  );

  if (h1Headings.length === 1) {
    return {
      id: 'h1',
      name: 'H1 heading',
      status: 'Passed',
      message: 'Exactly one H1 heading found.',
    };
  }

  if (h1Headings.length === 0) {
    return {
      id: 'h1',
      name: 'H1 heading',
      status: 'Failed',
      message: 'No H1 heading found.',
    };
  }

  return {
    id: 'h1',
    name: 'H1 heading',
    status: 'Failed',
    message: `${h1Headings.length} H1 headings found.`,
  };
}
