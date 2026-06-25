import { useEffect, useReducer } from 'react';
import { currencyReducer, initialState } from './currencyReducer';
import { fetchCurrencies, fetchPriceChanges } from '../api/currencyApi';
import { mapCurrency } from '../api/mappers/mapCurrency';
import { mapPriceChange } from '../api/mappers/mapPriceChange';

export function useCurrencyConverter() {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_CURRENCIES_START' });

    fetchCurrencies()
      .then((dtos) => {
        const currencies = dtos.map(mapCurrency);
        dispatch({ type: 'FETCH_CURRENCIES_SUCCESS', payload: currencies });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;

        const message = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_CURRENCIES_ERROR', payload: message });
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!state.fromCurrency || !state.toCurrency) return;

    const controller = new AbortController();
    dispatch({ type: 'FETCH_PRICES_START' });

    fetchPriceChanges(state.fromCurrency.code, state.toCurrency.code)
      .then((dtos) => {
        const priceChanges = dtos.map(mapPriceChange);
        dispatch({ type: 'FETCH_PRICES_SUCCESS', payload: priceChanges });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return;

        const message = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_PRICES_ERROR', payload: message });
      });

    return () => controller.abort();
  }, [
    state.fromCurrency?.code,
    state.toCurrency?.code,
    state.fromCurrency,
    state.toCurrency
  ]);

  const currentRate =
    state.priceChanges.length > 0
      ? state.priceChanges[state.priceChanges.length - 1].price
      : 0;

  const result = (() => {
    const num = Number(state.amount.replace(',', '.'));
    if (Number.isNaN(num) || num < 0) return '0.00';
    return (num * currentRate).toFixed(2);
  })();

  const handleFromCurrencyChange = (code: string) => {
    const target = state.currencies.find((c) => c.code === code);
    if (!target) return;

    if (code === state.toCurrency?.code) {
      const fallback = state.fromCurrency;

      if (fallback) dispatch({ type: 'SET_TO_CURRENCY', payload: fallback });
    }
    dispatch({ type: 'SET_FROM_CURRENCY', payload: target });
  };

  const handleToCurrencyChange = (code: string) => {
    const target = state.currencies.find((c) => c.code === code);
    if (!target) return;

    if (code === state.fromCurrency?.code) {
      const fallback =
        state.currencies.find(
          (c) => c.code !== code && c.code !== state.toCurrency?.code
        ) ?? state.currencies.find((c) => c.code !== code);

      if (fallback) dispatch({ type: 'SET_FROM_CURRENCY', payload: fallback });
    }
    dispatch({ type: 'SET_TO_CURRENCY', payload: target });
  };

  const handleSwap = () => {
    dispatch({ type: 'SWAP_CURRENCIES' });
  };

  const handleAmountChange = (value: string) => {
    dispatch({ type: 'SET_AMOUNT', payload: value });
  };

  return {
    state,
    result,
    currentRate,
    handleFromCurrencyChange,
    handleToCurrencyChange,
    handleSwap,
    handleAmountChange
  };
}
