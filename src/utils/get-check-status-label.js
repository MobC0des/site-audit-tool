export function getCheckStatusLabel(status) {
  if (status === 'Pass') {
    return 'Passed';
  } else if (status === 'Fail') {
    return 'Failed';
  } else if (status === 'Warning') {
    return 'Warning';
  } else {
    return 'Pending';
  }
}
