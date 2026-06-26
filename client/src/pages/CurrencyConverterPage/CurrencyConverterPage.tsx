import { useMemo } from 'react';
import styles from './CurrencyConverterPage.module.scss';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';
import { useCurrencyConverter } from '../../hooks/useCurrencyConverter';
import type { CurrencyConverterData } from '../../shared/types/currency';

export const CurrencyConverterPage = () => {
  const {
    state,
    result,
    handleAmountChange,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    handleSwap
  } = useCurrencyConverter();

  const {
    currencies,
    priceChanges,
    fromCurrency,
    toCurrency,
    amount,
    isLoading,
    error
  } = state;

  const hasInitialLoadError = Boolean(error && currencies.length === 0);
  const hasRuntimeError = Boolean(error && currencies.length > 0);

  const fromCode = fromCurrency?.code || '';
  const toCode = toCurrency?.code || '';

  const currentRateData =
    priceChanges.length > 0 ? priceChanges[priceChanges.length - 1] : undefined;

  const fallbackDescription = 'No description available for this currency.';

  const infoBlocks = useMemo(() => {
    return [
      {
        title: fromCurrency?.name || fromCode || 'Loading...',
        description: fromCurrency?.description || fallbackDescription,
        code: fromCode,
        symbol: fromCurrency?.symbol || ''
      },
      {
        title: toCurrency?.name || toCode || 'Loading...',
        description: toCurrency?.description || fallbackDescription,
        code: toCode,
        symbol: toCurrency?.symbol || ''
      }
    ];
  }, [fromCurrency, toCurrency, fromCode, toCode]);

  const uiData: CurrencyConverterData = useMemo(() => {
    return {
      headline: `1 ${fromCurrency?.name || fromCode} is`,
      result: `${result} ${toCurrency?.name || toCode}`,
      updatedAt: currentRateData
        ? new Date(currentRateData.dateTime).toUTCString()
        : 'Unknown date',
      pairLabel: `${fromCode}/${toCode}`,
      topRow: {
        amount,
        currencyCode: fromCode,
        options: currencies
      },
      bottomRow: {
        amount: result,
        currencyCode: toCode,
        options: currencies
      },
      infoBlocks
    };
  }, [
    fromCurrency,
    toCurrency,
    fromCode,
    toCode,
    amount,
    result,
    currentRateData,
    currencies,
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
