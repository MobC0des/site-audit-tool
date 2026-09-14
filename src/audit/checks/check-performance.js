export function checkPerformance(performanceScore) {
  if (performanceScore >= 90) {
    return {
      id: 'performance',
      name: 'Performance',
      status: 'Passed',
      message: `Performance score is ${performanceScore}`,
    }
  }
  else if (performanceScore >= 50) {
    return {
      id: 'performance',
      name: 'Performance',
      status: 'Warning',
      message: `Performance score is ${performanceScore}`,
    }
  }
  else {
    return {
      id: 'performance',
      name: 'Performance',
      status: 'Failed',
      message: `Performance score is ${performanceScore}`,
    }
  }
}
