export type Currency = {
  code: string;
  name: string;
  description: string;
  symbol: string;
};

export type PriceChange = {
  purchasedCurrencyCode: string;
  paymentCurrencyCode: string;
  price: number;
  dateTime: string; // ISO 8601 string
};

export type PriceChangesMock = Record<string, Record<string, PriceChange>>;

export type CurrencyOption = {
  code: string;
  label: string;
};

export type CurrencyInfo = {
  title: string;
  code: string;
  symbol: string;
  description: string;
};

export type CurrencyRowData = {
  amount: string;
  currencyCode: string;
  options: CurrencyOption[];
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
