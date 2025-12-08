/**
 * Format a number in compact notation (K, M, B).
 *
 * @param value - The number to format.
 * @returns Formatted string (e.g., "1.50K").
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(0);
}
