export function intervalCheck(start, end, period = 5) {
  const endTime = end ?? new Date().getTime(); // This represents the current date + time

  const difference = (Math.abs(endTime - start) / (1000 * 60)) % 60;

  // Handling the difference
  if (difference > period) {
    return true;
  }
  return false;
}
