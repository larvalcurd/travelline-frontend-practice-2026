// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CurrencyConverterPage } from './CurrencyConverterPage';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';
//import '@testing-library/jest-dom';

// 1. Импортируем сами матчеры
import * as matchers from '@testing-library/jest-dom/matchers';

// 2. Вручную добавляем их в expect из Vitest
expect.extend(matchers);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getCurrencyInfo(code: string) {
  const currency = MOCK_CURRENCIES.find((item) => item.code === code);

  if (!currency) {
    throw new Error(`Currency ${code} not found in mocks`);
  }

  return currency;
}

function getCurrencySelects() {
  return screen.getAllByLabelText('Currency') as HTMLSelectElement[];
}

function getAmountInputs() {
  const inputs = screen.getAllByLabelText('Amount') as HTMLInputElement[];

  const editable = inputs.find((input) => !input.readOnly);
  const readonly = inputs.find((input) => input.readOnly);

  if (!editable || !readonly) {
    throw new Error('Amount inputs were not found');
  }

  return { editable, readonly };
}

describe('CurrencyConverterPage', () => {
  it('renders initial state from mocks', async () => {
    render(<CurrencyConverterPage />);

    const [fromSelect, toSelect] = getCurrencySelects();
    const { editable, readonly } = getAmountInputs();

    expect(fromSelect).toHaveValue('PLN');
    expect(toSelect).toHaveValue('JPY');
    expect(editable).toHaveValue('1');

    const fromInfo = getCurrencyInfo('PLN');
    const toInfo = getCurrencyInfo('JPY');
    const initialRate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;
    const expectedResult = (1 * initialRate).toFixed(2);

    await waitFor(() => {
      expect(readonly).toHaveValue(expectedResult);
    });

    expect(
      screen.getByText(
        new RegExp(
          `^1\\s(?:${escapeRegExp(fromInfo.name)}|PLN)\\sis$`,
          'i'
        )
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: new RegExp(
          `^${escapeRegExp(expectedResult)}\\s(?:${escapeRegExp(toInfo.name)}|JPY)$`,
          'i'
        )
      })
    ).toBeInTheDocument();
  });

  it('recalculates conversion when amount changes', async () => {
    render(<CurrencyConverterPage />);

    const { editable, readonly } = getAmountInputs();
    const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;

    fireEvent.change(editable, { target: { value: '2' } });

    await waitFor(() => {
      expect(readonly).toHaveValue((2 * rate).toFixed(2));
    });
  });

  it('supports comma in amount input', async () => {
    render(<CurrencyConverterPage />);

    const { editable, readonly } = getAmountInputs();
    const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;

    fireEvent.change(editable, { target: { value: '1,5' } });

    await waitFor(() => {
      expect(readonly).toHaveValue((1.5 * rate).toFixed(2));
    });
  });

  it('does not allow selecting the same currency in both selects', async () => {
    render(<CurrencyConverterPage />);

    let [fromSelect, toSelect] = getCurrencySelects();

    fireEvent.change(toSelect, { target: { value: 'PLN' } });

    await waitFor(() => {
      [fromSelect, toSelect] = getCurrencySelects();

      expect(toSelect).toHaveValue('PLN');
      expect(fromSelect.value).not.toBe('PLN');
      expect(fromSelect.value).not.toBe(toSelect.value);
    });

    fireEvent.change(fromSelect, { target: { value: 'PLN' } });

    await waitFor(() => {
      [fromSelect, toSelect] = getCurrencySelects();

      expect(fromSelect).toHaveValue('PLN');
      expect(toSelect.value).not.toBe('PLN');
      expect(fromSelect.value).not.toBe(toSelect.value);
    });
  });

  it('swaps currencies and recalculates result', async () => {
    render(<CurrencyConverterPage />);

    const swapButton = screen.getByRole('button', { name: /swap/i });

    fireEvent.click(swapButton);

    await waitFor(() => {
      const [fromSelect, toSelect] = getCurrencySelects();
      const { readonly } = getAmountInputs();

      expect(fromSelect).toHaveValue('JPY');
      expect(toSelect).toHaveValue('PLN');

      const swappedRate = MOCK_PRICE_CHANGES['JPY']['PLN'].price;
      expect(readonly).toHaveValue((1 * swappedRate).toFixed(2));
    });
  });

  it('resets MoreAboutPair local state by key when pair changes', async () => {
    render(<CurrencyConverterPage />);

    const initialButton = screen.getByRole('button', {
      name: /more about pln\/jpy/i
    });

    fireEvent.click(initialButton);

    const plnInfo = getCurrencyInfo('PLN');
    const openedTitleMatcher = new RegExp(
      `${escapeRegExp(plnInfo.name)}\\s-\\sPLN`,
      'i'
    );

    expect(screen.getByText(openedTitleMatcher)).toBeInTheDocument();

    const alternativeCodes = MOCK_CURRENCIES
      .map((item) => item.code)
      .filter((code) => !['PLN', 'JPY'].includes(code));

    expect(alternativeCodes.length).toBeGreaterThanOrEqual(2);

    const [nextFrom, nextTo] = alternativeCodes;

    let [fromSelect, toSelect] = getCurrencySelects();

    fireEvent.change(fromSelect, { target: { value: nextFrom } });
    fireEvent.change(toSelect, { target: { value: nextTo } });

    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: new RegExp(`more about ${nextFrom}/${nextTo}`, 'i')
        })
      ).toBeInTheDocument();

      expect(screen.queryByText(openedTitleMatcher)).not.toBeInTheDocument();
    });

    const nextFromInfo = getCurrencyInfo(nextFrom);
    const nextTitleMatcher = new RegExp(
      `${escapeRegExp(nextFromInfo.name)}\\s-\\s${escapeRegExp(nextFrom)}`,
      'i'
    );

    expect(screen.queryByText(nextTitleMatcher)).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', {
        name: new RegExp(`more about ${nextFrom}/${nextTo}`, 'i')
      })
    );

    expect(screen.getByText(nextTitleMatcher)).toBeInTheDocument();
  });
});