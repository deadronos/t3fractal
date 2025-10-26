/**
 * Number Formatting Utilities
 * 
 * Provides consistent number formatting across the application.
 */

/**
 * Format a number with appropriate magnitude suffix (K, M, B).
 * 
 * @param value - The number to format
 * @returns Formatted string with suffix
 * 
 * @example
 * formatNumber(1234) // "1.23K"
 * formatNumber(1234567) // "1.23M"
 * formatNumber(1234567890) // "1.23B"
 * formatNumber(42) // "42"
 */
export const formatNumber = (value: number): string => {
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
};
