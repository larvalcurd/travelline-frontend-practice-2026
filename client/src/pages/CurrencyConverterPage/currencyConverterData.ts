import type { CurrencyConverterData } from '../../shared/types/currency';

export const currencyConverterData: CurrencyConverterData = {
  headline: '1 Polish zloty is',
  result: '0.99 Japanese yen',
  updatedAt: 'Fri, 05 Apr 2024 10:34 UTC',
  topRow: {
    amount: '1',
    currencyCode: 'PLN',
    options: [
      { code: 'PLN', label: 'PLN' },
      { code: 'USD', label: 'USD' },
      { code: 'EUR', label: 'EUR' },
      { code: 'JPY', label: 'JPY' }
    ]
  },
  bottomRow: {
    amount: '0,99',
    currencyCode: 'JPY',
    options: [
      { code: 'JPY', label: 'JPY' },
      { code: 'PLN', label: 'PLN' },
      { code: 'USD', label: 'USD' },
      { code: 'EUR', label: 'EUR' }
    ]
  },
  pairLabel: 'PLN/JPY: about',
  infoBlocks: [
    {
      title: 'Polish zloty - PLN - zł',
      description:
        'This is the official currency and legal tender of Poland. It is subdivided into 100 grosz-y (gr). It is the most traded currency in Central and Eastern Europe and ranks 21st most-traded in the foreign exchange market.'
    },
    {
      title: 'Japanese yen - JPY - ¥',
      description:
        'The yen is the official currency of Japan. It is the third-most traded currency in the foreign exchange market, after the United States dollar and the euro. It is also widely used as a third reserve currency after the US dollar and the euro.'
    }
  ]
};
