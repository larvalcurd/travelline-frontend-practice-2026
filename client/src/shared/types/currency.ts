import type { Currency } from '../../models/Currency';
import type { PriceChange } from '../../models/PriceChange';

export type { Currency, PriceChange };

export type PriceChangesMock = Record<string, Record<string, PriceChange>>;

export type CurrencyInfo = {
  title: string;
  code: string;
  symbol: string;
  description: string;
};

export type CurrencyRowData = {
  amount: string;
  currencyCode: string;
  options: Currency[];
};

export type CurrencyConverterData = {
  headline: string;
  result: string;
  updatedAt: string;
  topRow: CurrencyRowData;
  bottomRow: CurrencyRowData;
  pairLabel: string;
  infoBlocks: CurrencyInfo[];
};
