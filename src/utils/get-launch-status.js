export function getLaunchStatus(progress) {
  if (progress === 100) {
    return 'Ready to launch';
  }
  else if (progress >= 90) {
    return 'Final checks';
  }
  else if (progress >= 70) {
    return 'Nearly ready';
  }
  else if (progress === 0) {
    return 'Not started';
  } else {
    return 'Not ready';
  }
}
