import { useState, useMemo, useEffect } from 'react';
import styles from './CurrencyConverterPage.module.scss';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';
import type {
  CurrencyConverterData,
  CurrencyOption
} from '../../shared/types/currency';

export function CurrencyConverterPage() {
  const [fromCurrency, setFromCurrency] = useState<string>('PLN');
  const [toCurrency, setToCurrency] = useState<string>('JPY');
  const [amount, setAmount] = useState<string>('1');
  const [result, setResult] = useState('0.0000');

  const currencyOptions: CurrencyOption[] = useMemo(() => {
    return MOCK_CURRENCIES.map((c) => ({
      code: c.code,
      label: c.code
    }));
  }, []);

  const handleFromCurrencyChange = (newFrom: string) => {
    if (newFrom === toCurrency) {
      const fallback =
        MOCK_CURRENCIES.find((c) => c.code !== newFrom)?.code || '';
      setToCurrency(fallback);
    }
    setFromCurrency(newFrom);
  };

  const handleToCurrencyChange = (newTo: string) => {
    if (newTo === fromCurrency) {
      const fallback =
        MOCK_CURRENCIES.find((c) => c.code !== newTo)?.code || '';
      setFromCurrency(fallback);
    }
    setToCurrency(newTo);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currentRateData = MOCK_PRICE_CHANGES[fromCurrency]?.[toCurrency];
  const rate = currentRateData ? currentRateData.price : 0;

  useEffect(() => {
    const normalizedAmount = amount.replace(',', '.');
    const numAmount = Number(normalizedAmount);

    if (Number.isNaN(numAmount) || numAmount < 0) {
      setResult('0.00');
      return;
    }

    setResult((numAmount * rate).toFixed(2));
  }, [amount, fromCurrency, toCurrency, rate]);

  const fromInfo = MOCK_CURRENCIES.find((c) => c.code === fromCurrency);
  const toInfo = MOCK_CURRENCIES.find((c) => c.code === toCurrency);

  const fallbackDescription = 'No description available for this currency.';

  const uiData: CurrencyConverterData = useMemo(() => {
    return {
      headline: `1 ${fromInfo?.name || fromCurrency} is`,
      result: `${rate} ${toInfo?.name || toCurrency}`,
      updatedAt: currentRateData
        ? new Date(currentRateData.dateTime).toUTCString()
        : 'Unknown date',
      pairLabel: `${fromCurrency}/${toCurrency}`,
      topRow: {
        amount: amount,
        currencyCode: fromCurrency,
        options: currencyOptions
      },
      bottomRow: {
        amount: result,
        currencyCode: toCurrency,
        options: currencyOptions
      },
      infoBlocks: [
        {
          title: fromInfo?.name || fromCurrency,
          description: fromInfo?.description || fallbackDescription,
          code: fromCurrency,
          symbol: fromInfo?.symbol || 'x'
        },
        {
          title: toInfo?.name || toCurrency,
          description: toInfo?.description || fallbackDescription,
          code: toCurrency,
          symbol: toInfo?.symbol || ''
        }
      ]
    };
  }, [
    fromCurrency,
    toCurrency,
    amount,
    result,
    fromInfo,
    toInfo,
    currentRateData,
    currencyOptions
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
}
