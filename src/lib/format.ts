export function formatNumber(value: number, digits = 2): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) {
    return `${sign}${(abs / 1e12).toFixed(2)}T`;
  }
  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(2)}B`;
  }
  if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(2)}M`;
  }
  if (abs >= 1e3) {
    return `${sign}${abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }
  if (abs >= 10) {
    return `${sign}${abs.toFixed(1)}`;
  }
  return `${sign}${abs.toFixed(digits)}`;
}

export function formatRate(value: number): string {
  return `${formatNumber(value, 2)}/s`;
}
