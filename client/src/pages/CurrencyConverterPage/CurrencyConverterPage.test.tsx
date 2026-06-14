import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CurrencyConverterPage } from './CurrencyConverterPage';
import { expect, it } from 'vitest';
import { MOCK_CURRENCIES, MOCK_PRICE_CHANGES } from '../../mocks';

function getCurrencySelects() {
  return screen.getAllByLabelText('Currency') as HTMLSelectElement[];
}

function getAmountInputs() {
  const inputs = screen.getAllByLabelText('Amount') as HTMLInputElement[];
  const editable = inputs.find((input) => !input.readOnly)!;
  const readonly = inputs.find((input) => input.readOnly)!;
  return { editable, readonly };
}

it('renders initial state from mocks', async () => {
  render(<CurrencyConverterPage />);

  const [fromSelect, toSelect] = getCurrencySelects();
  const { editable, readonly } = getAmountInputs();

  // Проверяем, что selects показывают дефолтные валюты
  expect(fromSelect.value).toBe('PLN');
  expect(toSelect.value).toBe('JPY');

  // Проверяем дефолтную сумму
  expect((editable as HTMLInputElement).value).toBe('1');

  // Берём курс прямо из мока
  const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;
  const expectedResult = (1 * rate).toFixed(2);

  // waitFor нужен, потому что result обновляется через useEffect
  // useEffect срабатывает после рендера, а не во время
  await waitFor(() => {
    expect((readonly as HTMLInputElement).value).toBe(expectedResult);
  });
});

it('recalculates result when amount changes', async () => {
  render(<CurrencyConverterPage />);

  const { editable, readonly } = getAmountInputs();
  const rate = MOCK_PRICE_CHANGES['PLN']['JPY'].price;

  fireEvent.change(editable, { target: { value: '2' } });

  await waitFor(() => {
    expect((readonly as HTMLInputElement).value).toBe((2 * rate).toFixed(2));
  });
});

it('recalculates result when currency pair changes', async () => {
  render(<CurrencyConverterPage />);

  const [fromSelect] = getCurrencySelects();
  const { readonly } = getAmountInputs();

  const newFrom = MOCK_CURRENCIES.find(
    (c) => c.code !== 'PLN' && c.code !== 'JPY'
  )!.code;

  fireEvent.change(fromSelect, { target: { value: newFrom } });

  const rate = MOCK_PRICE_CHANGES[newFrom]?.['JPY']?.price ?? 0;
  const expected = (1 * rate).toFixed(2);

  await waitFor(() => {
    expect((readonly as HTMLInputElement).value).toBe(expected);
  });
});

it('prevents same currency in both selects when changing to-currency', async () => {
  render(<CurrencyConverterPage />);

  const [, toSelect] = getCurrencySelects();
  fireEvent.change(toSelect, { target: { value: 'PLN' } });

  await waitFor(() => {
    const [fromSelect, updatedToSelect] = getCurrencySelects();

    expect(updatedToSelect.value).toBe('PLN');

    expect(fromSelect.value).not.toBe('PLN');
  });
});

it('prevents same currency in both selects when changing from-currency', async () => {
  render(<CurrencyConverterPage />);

  const [fromSelect] = getCurrencySelects();
  fireEvent.change(fromSelect, { target: { value: 'JPY' } });

  await waitFor(() => {
    const [updatedFromSelect, toSelect] = getCurrencySelects();

    expect(updatedFromSelect.value).toBe('JPY');
    expect(toSelect.value).not.toBe('JPY');
  });
});

it('swaps currencies and recalculates result', async () => {
  render(<CurrencyConverterPage />);

  const swapButton = screen.getByRole('button', { name: /swap/i });
  fireEvent.click(swapButton);

  await waitFor(() => {
    const [fromSelect, toSelect] = getCurrencySelects();
    const { readonly } = getAmountInputs();

    expect(fromSelect.value).toBe('JPY');
    expect(toSelect.value).toBe('PLN');

    const rate = MOCK_PRICE_CHANGES['JPY']['PLN'].price;
    expect((readonly as HTMLInputElement).value).toBe((1 * rate).toFixed(2));
  });
});

it('resets MoreAboutPair open state when currency pair changes', async () => {
  render(<CurrencyConverterPage />);

  // Находим кнопку раскрытия блока для текущей пары PLN/JPY
  const toggleButton = screen.getByRole('button', {
    name: /more about pln\/jpy/i
  });

  // Открываем блок
  fireEvent.click(toggleButton);

  // Проверяем, что описание PLN видно
  // Берём description прямо из мока, чтобы не хардкодить текст
  const plnDescription = MOCK_CURRENCIES.find(
    (c) => c.code === 'PLN'
  )!.description;

  expect(screen.getByText(plnDescription)).toBeInTheDocument();

  const [fromSelect] = getCurrencySelects();
  const newFrom = MOCK_CURRENCIES.find(
    (c) => c.code !== 'PLN' && c.code !== 'JPY'
  )!.code;
  fireEvent.change(fromSelect, { target: { value: newFrom } });

  await waitFor(() => {
    expect(
      screen.getByRole('button', {
        name: new RegExp(`more about ${newFrom}/jpy`, 'i')
      })
    ).toBeInTheDocument();

    expect(screen.queryByText(plnDescription)).not.toBeInTheDocument();
  });
});
