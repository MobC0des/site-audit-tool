export function calculateProgress(checks) {
  const completedChecks = checks.filter((check) => check.complete);

  return Math.round(
    completedChecks.length / checks.length * 100,
  );
}
