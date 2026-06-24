import type { Currency } from '../models/Currency';
import type { PriceChange } from '../models/PriceChange';

export type CurrencyState = {
  currencies: Currency[];
  priceChanges: PriceChange[];
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  isLoading: boolean;
  error: string | null;
};

export type CurrencyAction =
  | { type: 'FETCH_CURRENCIES_START' }
  | { type: 'FETCH_CURRENCIES_SUCCESS'; payload: Currency[] }
  | { type: 'FETCH_CURRENCIES_ERROR'; payload: string }
  | { type: 'FETCH_PRICES_START' }
  | { type: 'FETCH_PRICES_SUCCESS'; payload: PriceChange[] }
  | { type: 'FETCH_PRICES_ERROR'; payload: string }
  | { type: 'SET_FROM_CURRENCY'; payload: string }
  | { type: 'SET_TO_CURRENCY'; payload: string }
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SWAP_CURRENCIES' };

export const initialState: CurrencyState = {
  currencies: [],
  priceChanges: [],
  fromCurrency: '',
  toCurrency: '',
  amount: '1',
  isLoading: false,
  error: null
};

export function currencyReducer(
  state: CurrencyState,
  action: CurrencyAction
): CurrencyState {
  switch (action.type) {
    case 'FETCH_CURRENCIES_START':
      return { ...state, isLoading: true, error: null };

    case 'FETCH_CURRENCIES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        currencies: action.payload,
        fromCurrency: action.payload[0]?.code ?? '',
        toCurrency: action.payload[1]?.code ?? ''
      };

    case 'FETCH_CURRENCIES_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'FETCH_PRICES_START':
      return { ...state, isLoading: true, error: null, priceChanges: [] };

    case 'FETCH_PRICES_SUCCESS':
      return { ...state, isLoading: false, priceChanges: action.payload };

    case 'FETCH_PRICES_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'SET_FROM_CURRENCY':
      return { ...state, fromCurrency: action.payload };

    case 'SET_TO_CURRENCY':
      return { ...state, toCurrency: action.payload };

    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };

    case 'SWAP_CURRENCIES':
      return {
        ...state,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency
      };

    default:
      return state;
  }
}
