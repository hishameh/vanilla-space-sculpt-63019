// src/utils/formatters.ts
export function formatCurrency(value: number | string | undefined | null, currency = 'INR'): string {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return '';

  // Choose locale for INR; you can change or parameterize this if needed.
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(num);
  } catch {
    // Fallback to simple formatting if Intl fails for some currency code
    return `${currency} ${Math.round(num).toLocaleString()}`;
  }
}
