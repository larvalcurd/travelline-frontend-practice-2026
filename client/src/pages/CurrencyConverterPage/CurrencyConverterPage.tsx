import { useState, useMemo } from 'react';
import styles from './CurrencyConverterPage.module.scss';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';
import type { CurrencyConverterData } from '../../shared/types/currency';

export const CurrencyConverterPage = () => {
  const [fromCurrency, setFromCurrency] = useState(
    () => MOCK_CURRENCIES.find((c) => c.code === 'PLN')!
  );
  const [toCurrency, setToCurrency] = useState(
    () => MOCK_CURRENCIES.find((c) => c.code === 'JPY')!
  );
  const [amount, setAmount] = useState<string>('1');

  const handleFromCurrencyChange = (nextFrom: (typeof MOCK_CURRENCIES)[0]) => {
    if (nextFrom.code === toCurrency.code) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(nextFrom);
  };

  const handleToCurrencyChange = (nextTo: (typeof MOCK_CURRENCIES)[0]) => {
    if (nextTo.code === fromCurrency.code) {
      setFromCurrency(toCurrency);
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
        options: MOCK_CURRENCIES
      },
      bottomRow: {
        amount: result,
        currencyCode: toCurrency.code,
        options: MOCK_CURRENCIES
      },
      infoBlocks
    };
  }, [
    fromCurrency,
    toCurrency,
    amount,
    result,
    currentRateData,
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
