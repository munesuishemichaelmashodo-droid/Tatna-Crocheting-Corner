export type CurrencyCode = 'USD';

export function formatPrice(amountUSD: number, currency: CurrencyCode = 'USD', rates?: { USD: number }): string {
  return `$${amountUSD.toFixed(0)}`;
}
