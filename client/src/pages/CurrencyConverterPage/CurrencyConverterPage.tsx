import { useMemo } from 'react';
import styles from './CurrencyConverterPage.module.scss';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import type {
  Currency,
  CurrencyConverterData
} from '../../shared/types/currency';

export const CurrencyConverterPage = () => {
  const [fromCurrency, setFromCurrency] = useState<Currency>(
    () => MOCK_CURRENCIES[0]
  );
  const [toCurrency, setToCurrency] = useState<Currency>(
    () => MOCK_CURRENCIES[1]
  );
  const [amount, setAmount] = useState<string>('1');

  const handleFromCurrencyChange = (nextFrom: Currency) => {
    if (nextFrom.code === toCurrency.code) {
      setToCurrency(fromCurrency);
    }
    setFromCurrency(nextFrom);
  };

  const handleToCurrencyChange = (nextTo: Currency) => {
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
    priceChanges.length > 0 ? priceChanges[priceChanges.length - 1] : null;

  const fallbackDescription = 'No description available for this currency.';

  const infoBlocks = useMemo(() => {
    return [
      {
        title: fromCurrencyData?.name || fromCurrency, // Предохранитель на случай загрузки
        description: fromCurrencyData?.description || fallbackDescription,
        code: fromCurrency,
        symbol: fromCurrencyData?.symbol || ''
      },
      {
        title: toCurrencyData?.name || toCurrency,
        description: toCurrencyData?.description || fallbackDescription,
        code: toCurrency,
        symbol: toCurrencyData?.symbol || ''
      }
    ];
  }, [fromCurrencyData, toCurrencyData, fromCurrency, toCurrency]);

  const uiData: CurrencyConverterData = useMemo(() => {
    return {
      headline: `1 ${fromCurrencyData?.name || fromCurrency} is`,
      result: `${result} ${toCurrencyData?.name || toCurrency}`,
      updatedAt: currentRateData
        ? new Date(currentRateData.dateTime).toUTCString()
        : 'Unknown date',
      pairLabel: `${fromCurrency}/${toCurrency}`,
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
    fromCurrencyData,
    toCurrencyData,
    fromCurrency,
    toCurrency,
    amount,
    result,
    currentRateData,
    rate,
    infoBlocks
  ]);

  if (isLoading && currencies.length === 0) {
    return (
      <main className={styles.page}>
        <p>Loading...</p>
      </main>
    );
  }

  if (hasInitialLoadError) {
    return (
      <main className={styles.page}>
        <p>Server error: {error}</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {hasRuntimeError && (
        <div className={styles.toast} role="alert" aria-live="assertive">
          <strong className={styles['toast-title']}>Server error</strong>
          <span className={styles['toast-message']}>
            We could not update the exchange rate. Please try again later.
          </span>
        </div>
      )}

      <ConverterCard
        data={uiData}
        onAmountChange={handleAmountChange}
        onFromCurrencyChange={handleFromCurrencyChange}
        onToCurrencyChange={handleToCurrencyChange}
        onSwap={handleSwap}
      />
    </main>
  );
};
