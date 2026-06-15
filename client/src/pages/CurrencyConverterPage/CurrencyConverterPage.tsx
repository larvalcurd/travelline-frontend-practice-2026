import { useState, useMemo } from 'react';
import styles from './CurrencyConverterPage.module.scss';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';
import type {
  CurrencyConverterData,
  CurrencyOption
} from '../../shared/types/currency';

export const CurrencyConverterPage = () => {
  const [fromCurrency, setFromCurrency] = useState(
    () => MOCK_CURRENCIES.find((c) => c.code === 'PLN')!
  );
  const [toCurrency, setToCurrency] = useState(
    () => MOCK_CURRENCIES.find((c) => c.code === 'JPY')!
  );
  const [amount, setAmount] = useState<string>('1');

  const currencyOptions: CurrencyOption[] = useMemo(() => {
    return MOCK_CURRENCIES.map((c) => ({
      code: c.code,
      label: c.code
    }));
  }, []);

  const handleFromCurrencyChange = (newFromCode: string) => {
    const nextFrom = MOCK_CURRENCIES.find((c) => c.code === newFromCode)!;

    if (newFromCode === toCurrency.code) {
      const fallback = MOCK_CURRENCIES.find((c) => c.code !== newFromCode)!;
      setToCurrency(fallback);
    }
    setFromCurrency(nextFrom);
  };

  const handleToCurrencyChange = (newToCode: string) => {
    const nextTo = MOCK_CURRENCIES.find((c) => c.code === newToCode)!;

    if (newToCode === fromCurrency.code) {
      const fallback = MOCK_CURRENCIES.find((c) => c.code !== newToCode)!;
      setFromCurrency(fallback);
    }
    setToCurrency(nextTo);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currentRateData =
    MOCK_PRICE_CHANGES[fromCurrency.code]?.[toCurrency.code];
  const rate = currentRateData ? currentRateData.price : 0;

  const normalizedAmount = amount.replace(',', '.');
  const numAmount = Number(normalizedAmount);

  const result =
    Number.isNaN(numAmount) || numAmount < 0
      ? '0.00'
      : (numAmount * rate).toFixed(2);

  const fallbackDescription = 'No description available for this currency.';

  const infoBlocks = useMemo(() => {
    return [
      {
        title: fromCurrency.name,
        description: fromCurrency.description || fallbackDescription,
        code: fromCurrency.code,
        symbol: fromCurrency.symbol || 'x'
      },
      {
        title: toCurrency.name,
        description: toCurrency.description || fallbackDescription,
        code: toCurrency.code,
        symbol: toCurrency.symbol || ''
      }
    ];
  }, [fromCurrency, toCurrency]);

  const uiData: CurrencyConverterData = useMemo(() => {
    return {
      headline: `1 ${fromCurrency.name} is`,
      result: `${rate} ${toCurrency.name}`,
      updatedAt: currentRateData
        ? new Date(currentRateData.dateTime).toUTCString()
        : 'Unknown date',
      pairLabel: `${fromCurrency.code}/${toCurrency.code}`,
      topRow: {
        amount: amount,
        currencyCode: fromCurrency.code,
        options: currencyOptions
      },
      bottomRow: {
        amount: result,
        currencyCode: toCurrency.code,
        options: currencyOptions
      },
      infoBlocks
    };
  }, [
    fromCurrency,
    toCurrency,
    amount,
    result,
    currentRateData,
    currencyOptions,
    rate,
    infoBlocks
  ]);

  return (
    <main className={styles.page}>
      <ConverterCard
        data={uiData}
        onAmountChange={setAmount}
        onFromCurrencyChange={handleFromCurrencyChange}
        onToCurrencyChange={handleToCurrencyChange}
        onSwap={handleSwap}
      />
    </main>
  );
};
