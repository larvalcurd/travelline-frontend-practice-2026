import { useEffect, useReducer } from 'react';
import { currencyReducer, initialState } from './currencyReducer';
import { fetchCurrencies, fetchPriceChanges } from '../api/currencyApi';
import { mapCurrency } from '../api/mappers/mapCurrency';
import { mapPriceChange } from '../api/mappers/mapPriceChange';
import type { Currency } from '../shared/types/currency';

export function useCurrencyConverter() {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'FETCH_CURRENCIES_START' });

    const loadCurrencies = async () => {
      try {
        const dtos = await fetchCurrencies(controller.signal);
        const currencies = dtos.map(mapCurrency);
        dispatch({ type: 'FETCH_CURRENCIES_SUCCESS', payload: currencies });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return;

        const message = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_CURRENCIES_ERROR', payload: message });
      }
    };

    loadCurrencies();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!state.fromCurrency || !state.toCurrency) return;

    const controller = new AbortController();
    dispatch({ type: 'FETCH_PRICES_START' });

    const loadPrices = async () => {
      try {
        const dtos = await fetchPriceChanges(
          state.fromCurrency!.code,
          state.toCurrency!.code,
          controller.signal
        );
        const priceChanges = dtos.map(mapPriceChange);
        dispatch({ type: 'FETCH_PRICES_SUCCESS', payload: priceChanges });
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;

        const message = err instanceof DOMException ? err.message : 'Unknown error';
        dispatch({ type: 'FETCH_PRICES_ERROR', payload: message });
      }
    };

    loadPrices();

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

  const handleFromCurrencyChange = (target: Currency) => {
    if (target.code === state.toCurrency?.code) {
      const fallback = state.fromCurrency;
      if (fallback) dispatch({ type: 'SET_TO_CURRENCY', payload: fallback });
    }
    dispatch({ type: 'SET_FROM_CURRENCY', payload: target });
  };

  const handleToCurrencyChange = (target: Currency) => {
    if (target.code === state.fromCurrency?.code) {
      const fallback =
        state.currencies.find(
          (c) => c.code !== target.code && c.code !== state.toCurrency?.code
        ) ?? state.currencies.find((c) => c.code !== target.code);

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
