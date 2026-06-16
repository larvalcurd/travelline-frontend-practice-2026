import type { CurrencyDto } from "./dto/CurrencyDto";
import type { PriceChangeDto } from "./dto/PriceChangeDto";

export const BASE_URL = 'http://localhost:5081';

export async function fetchCurrencies(): Promise<CurrencyDto[]> {
  const response = await fetch(`${BASE_URL}/Currency`);

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.status}`);
  }

  return response.json();
}

export async function fetchPriceChanges(
  paymentCurrency: string,
  purchasedCurrency: string
): Promise<PriceChangeDto[]> {
  const fromDateTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

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