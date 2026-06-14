import currenciesRaw from './2_hw_mock_currencies.json';
import priceChangesRaw from './2_hw_mock_price_changes.json';
import type { Currency, PriceChangesMock } from '../shared/types/currency';

export const MOCK_CURRENCIES = currenciesRaw as Currency[];
export const MOCK_PRICE_CHANGES = priceChangesRaw as PriceChangesMock;
