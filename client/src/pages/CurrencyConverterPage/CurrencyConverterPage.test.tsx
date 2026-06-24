import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { CurrencyConverterPage } from './CurrencyConverterPage';
import { expect, it } from 'vitest';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';

function getCurrencySelects() {
  return screen.getAllByLabelText('Currency') as HTMLSelectElement[];
}

function getAmountInputs() {
  const inputs = screen.getAllByLabelText('Amount') as HTMLInputElement[];
  const amountInput = inputs.find((input) => !input.readOnly)!;
  const resultInput = inputs.find((input) => input.readOnly)!;
  return { amountInput, resultInput };
}

it('renders initial state from mocks', () => {
  render(<CurrencyConverterPage />);

  const [fromSelect, toSelect] = getCurrencySelects();
  const { amountInput, resultInput } = getAmountInputs();

  expect(fromSelect.value).toBe('PLN');
  expect(toSelect.value).toBe('JPY');
  expect(amountInput.value).toBe('1');

  const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;
  expect(resultInput.value).toBe(rate.toFixed(2));
});

it('recalculates result when amount changes', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const { amountInput, resultInput } = getAmountInputs();
  const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;

  await user.clear(amountInput);
  await user.type(amountInput, '2');

  expect(resultInput.value).toBe((2 * rate).toFixed(2));
});

it('recalculates result when currency pair changes', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const [fromSelect] = getCurrencySelects();
  const { resultInput } = getAmountInputs();

  const newFrom = MOCK_CURRENCIES.find(
    (c) => c.code !== 'PLN' && c.code !== 'JPY'
  )!.code;

  await user.selectOptions(fromSelect, newFrom);

  const rate = MOCK_PRICE_CHANGES[newFrom]?.['JPY']?.price ?? 0;
  expect(resultInput.value).toBe(rate.toFixed(2));
});

it('prevents same currency in both selects when changing to-currency', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const [, toSelect] = getCurrencySelects();
  await user.selectOptions(toSelect, 'PLN');

  const [fromSelect, updatedToSelect] = getCurrencySelects();
  expect(updatedToSelect.value).toBe('PLN');
  expect(fromSelect.value).not.toBe('PLN');
});

it('prevents same currency in both selects when changing from-currency', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const [fromSelect] = getCurrencySelects();
  await user.selectOptions(fromSelect, 'JPY');

  const [updatedFromSelect, toSelect] = getCurrencySelects();
  expect(updatedFromSelect.value).toBe('JPY');
  expect(toSelect.value).not.toBe('JPY');
});

it('swaps currencies and recalculates result', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const swapButton = screen.getByRole('button', { name: /swap/i });
  await user.click(swapButton);

  const [fromSelect, toSelect] = getCurrencySelects();
  const { resultInput } = getAmountInputs();

  expect(fromSelect.value).toBe('JPY');
  expect(toSelect.value).toBe('PLN');

  const rate = MOCK_PRICE_CHANGES['JPY']['PLN'].price;
  expect(resultInput.value).toBe(rate.toFixed(2));
});

it('resets MoreAboutPair open state when currency pair changes', async () => {
  const user = userEvent.setup();
  render(<CurrencyConverterPage />);

  const toggleButton = screen.getByRole('button', {
    name: /pln\/jpy: about/i
  });
  await user.click(toggleButton);

  const plnDescription = MOCK_CURRENCIES.find(
    (c) => c.code === 'PLN'
  )!.description;
  expect(screen.getByText(plnDescription)).toBeInTheDocument();

  const [fromSelect] = getCurrencySelects();
  const newFrom = MOCK_CURRENCIES.find(
    (c) => c.code !== 'PLN' && c.code !== 'JPY'
  )!.code;

  await user.selectOptions(fromSelect, newFrom);

  expect(
    screen.getByRole('button', {
      name: new RegExp(`${newFrom}/jpy: about`, 'i')
    })
  ).toBeInTheDocument();
  expect(screen.queryByText(plnDescription)).not.toBeInTheDocument();
});
