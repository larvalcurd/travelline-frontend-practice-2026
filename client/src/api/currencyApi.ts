import type { CurrencyDto } from './dto/CurrencyDto';
import type { PriceChangeDto } from './dto/PriceChangeDto';

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5081';

const DAY_IN_MILLISECONDS = 86400000;

export async function fetchCurrencies(): Promise<CurrencyDto[]> {
  const url = new URL('Currency', BASE_URL).toString();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.status}`);
  }

  return response.json();
}

export async function fetchPriceChanges(
  paymentCurrency: string,
  purchasedCurrency: string
): Promise<PriceChangeDto[]> {
  const fromDateTime = new Date(Date.now() - DAY_IN_MILLISECONDS).toISOString();

  const url = new URL(`${BASE_URL}/prices`);
  url.searchParams.set('paymentCurrency', paymentCurrency);
  url.searchParams.set('purchasedCurrency', purchasedCurrency);
  url.searchParams.set('fromDateTime', fromDateTime);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch prices: ${response.status}`);
  }

  return response.json();
}
