export function getCheckStatusLabel(status) {
  if (status === 'Passed') {
    return 'Passed';
  } else if (status === 'Failed') {
    return 'Failed';
  } else if (status === 'Warning') {
    return 'Warning';
  } else {
    return 'Pending';
  }
}
