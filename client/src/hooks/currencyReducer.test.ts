import { describe, expect, it } from 'vitest';
import {
  currencyReducer,
  initialState,
  type CurrencyState
} from './currencyReducer';
import type { Currency } from '../models/Currency';
import type { PriceChange } from '../models/PriceChange';

const currencies: Currency[] = [
  {
    code: 'PLN',
    name: 'Polish Zloty',
    description: 'The official currency of Poland.',
    symbol: 'zł'
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    description: 'The official currency of Japan.',
    symbol: '¥'
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    description: 'The official currency of Canada.',
    symbol: '$'
  }
];

const priceChanges: PriceChange[] = [
  {
    purchasedCurrencyCode: 'JPY',
    paymentCurrencyCode: 'PLN',
    price: 37.42,
    dateTime: '2026-05-21T03:40:54.2709677Z'
  },
  {
    purchasedCurrencyCode: 'JPY',
    paymentCurrencyCode: 'PLN',
    price: 37.55,
    dateTime: '2026-05-21T04:40:54.2709677Z'
  }
];

function createState(overrides: Partial<CurrencyState> = {}): CurrencyState {
  return {
    ...initialState,
    ...overrides
  };
}

describe('currencyReducer', () => {
  it('handles FETCH_CURRENCIES_START by enabling loading and clearing previous error', () => {
    const state = createState({
      isLoading: false,
      error: 'Previous server error'
    });

    const result = currencyReducer(state, {
      type: 'FETCH_CURRENCIES_START'
    });

    expect(result).toEqual({
      ...state,
      isLoading: true,
      error: null
    });
  });

  it('handles FETCH_CURRENCIES_SUCCESS by saving currencies, disabling loading and selecting default pair', () => {
    const state = createState({
      isLoading: true,
      error: 'Previous server error',
      currencies: [],
      fromCurrency: '',
      toCurrency: ''
    });

    const result = currencyReducer(state, {
      type: 'FETCH_CURRENCIES_SUCCESS',
      payload: currencies
    });

    expect(result).toEqual({
      ...state,
      isLoading: false,
      currencies,
      fromCurrency: 'PLN',
      toCurrency: 'JPY'
    });
  });

  it('handles FETCH_CURRENCIES_SUCCESS with empty list by keeping selected pair empty', () => {
    const state = createState({
      isLoading: true,
      currencies: [],
      fromCurrency: '',
      toCurrency: ''
    });

    const result = currencyReducer(state, {
      type: 'FETCH_CURRENCIES_SUCCESS',
      payload: []
    });

    expect(result).toEqual({
      ...state,
      isLoading: false,
      currencies: [],
      fromCurrency: '',
      toCurrency: ''
    });
  });

  it('handles FETCH_CURRENCIES_ERROR by disabling loading and saving error message', () => {
    const state = createState({
      isLoading: true,
      error: null
    });

    const result = currencyReducer(state, {
      type: 'FETCH_CURRENCIES_ERROR',
      payload: 'Failed to fetch currencies: 500'
    });

    expect(result).toEqual({
      ...state,
      isLoading: false,
      error: 'Failed to fetch currencies: 500'
    });
  });

  it('handles FETCH_PRICES_START by enabling loading and clearing previous error', () => {
    const state = createState({
      currencies,
      priceChanges,
      fromCurrency: 'PLN',
      toCurrency: 'JPY',
      isLoading: false,
      error: 'Previous prices error'
    });

    const result = currencyReducer(state, {
      type: 'FETCH_PRICES_START'
    });

    expect(result).toEqual({
      ...state,
      isLoading: true,
      error: null
    });
  });

  it('handles FETCH_PRICES_SUCCESS by saving price changes and disabling loading', () => {
    const state = createState({
      currencies,
      priceChanges: [],
      fromCurrency: 'PLN',
      toCurrency: 'JPY',
      isLoading: true,
      error: 'Previous prices error'
    });

    const result = currencyReducer(state, {
      type: 'FETCH_PRICES_SUCCESS',
      payload: priceChanges
    });

    expect(result).toEqual({
      ...state,
      isLoading: false,
      priceChanges
    });
  });

  it('handles FETCH_PRICES_ERROR by disabling loading and saving error message', () => {
    const state = createState({
      currencies,
      priceChanges,
      fromCurrency: 'PLN',
      toCurrency: 'JPY',
      isLoading: true,
      error: null
    });

    const result = currencyReducer(state, {
      type: 'FETCH_PRICES_ERROR',
      payload: 'Failed to fetch prices: 500'
    });

    expect(result).toEqual({
      ...state,
      isLoading: false,
      error: 'Failed to fetch prices: 500'
    });
  });

  it('handles SET_FROM_CURRENCY by updating source currency', () => {
    const state = createState({
      currencies,
      fromCurrency: 'PLN',
      toCurrency: 'JPY'
    });

    const result = currencyReducer(state, {
      type: 'SET_FROM_CURRENCY',
      payload: 'CAD'
    });

    expect(result).toEqual({
      ...state,
      fromCurrency: 'CAD'
    });
  });

  it('handles SET_TO_CURRENCY by updating target currency', () => {
    const state = createState({
      currencies,
      fromCurrency: 'PLN',
      toCurrency: 'JPY'
    });

    const result = currencyReducer(state, {
      type: 'SET_TO_CURRENCY',
      payload: 'CAD'
    });

    expect(result).toEqual({
      ...state,
      toCurrency: 'CAD'
    });
  });

  it('handles SET_AMOUNT by updating amount', () => {
    const state = createState({
      amount: '1'
    });

    const result = currencyReducer(state, {
      type: 'SET_AMOUNT',
      payload: '250.5'
    });

    expect(result).toEqual({
      ...state,
      amount: '250.5'
    });
  });

  it('handles SWAP_CURRENCIES by swapping selected currencies', () => {
    const state = createState({
      fromCurrency: 'PLN',
      toCurrency: 'JPY'
    });

    const result = currencyReducer(state, {
      type: 'SWAP_CURRENCIES'
    });

    expect(result).toEqual({
      ...state,
      fromCurrency: 'JPY',
      toCurrency: 'PLN'
    });
  });

  it('does not mutate previous state object', () => {
    const state = createState({
      currencies,
      priceChanges,
      fromCurrency: 'PLN',
      toCurrency: 'JPY',
      amount: '1',
      isLoading: false,
      error: null
    });

    const result = currencyReducer(state, {
      type: 'SET_AMOUNT',
      payload: '10'
    });

    expect(result).not.toBe(state);
    expect(state.amount).toBe('1');
    expect(result.amount).toBe('10');
  });
});
