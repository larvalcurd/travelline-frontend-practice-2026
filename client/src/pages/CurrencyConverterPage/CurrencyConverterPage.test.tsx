import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CurrencyConverterPage } from './CurrencyConverterPage';
import type { CurrencyDto } from '../../api/dto/CurrencyDto';
import type { PriceChangeDto } from '../../api/dto/PriceChangeDto';

const currenciesDto: CurrencyDto[] = [
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

const priceChangesByPair: Record<string, PriceChangeDto[]> = {
  'PLN-JPY': [
    {
      purchasedCurrencyCode: 'JPY',
      paymentCurrencyCode: 'PLN',
      price: 37.42,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ],
  'CAD-JPY': [
    {
      purchasedCurrencyCode: 'JPY',
      paymentCurrencyCode: 'CAD',
      price: 104.5,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ],
  'JPY-PLN': [
    {
      purchasedCurrencyCode: 'PLN',
      paymentCurrencyCode: 'JPY',
      price: 0.027,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ],
  'CAD-PLN': [
    {
      purchasedCurrencyCode: 'PLN',
      paymentCurrencyCode: 'CAD',
      price: 2.75,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ],
  'PLN-CAD': [
    {
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 0.36,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ],
  'JPY-CAD': [
    {
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'JPY',
      price: 0.0096,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    }
  ]
};

function createJsonResponse<T>(body: T, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body)
  } as unknown as Response;
}

function mockSuccessfulApi() {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = new URL(input.toString());

      if (url.pathname.endsWith('/Currency')) {
        return Promise.resolve(createJsonResponse(currenciesDto));
      }

      if (url.pathname.endsWith('/prices')) {
        const paymentCurrency = url.searchParams.get('paymentCurrency');
        const purchasedCurrency = url.searchParams.get('purchasedCurrency');
        const pairKey = `${paymentCurrency}-${purchasedCurrency}`;
        const priceChanges = priceChangesByPair[pairKey] ?? [];

        return Promise.resolve(createJsonResponse(priceChanges));
      }

      return Promise.resolve(createJsonResponse(null, false, 404));
    })
  );
}

function mockFailedCurrenciesApi() {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = new URL(input.toString());

      if (url.pathname.endsWith('/Currency')) {
        return Promise.resolve(createJsonResponse(null, false, 500));
      }

      return Promise.resolve(createJsonResponse(null, false, 404));
    })
  );
}

function mockFailedPricesApi() {
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL) => {
      const url = new URL(input.toString());

      if (url.pathname.endsWith('/Currency')) {
        return Promise.resolve(createJsonResponse(currenciesDto));
      }

      if (url.pathname.endsWith('/prices')) {
        return Promise.resolve(createJsonResponse(null, false, 500));
      }

      return Promise.resolve(createJsonResponse(null, false, 404));
    })
  );
}

async function getCurrencySelects() {
  return (await screen.findAllByLabelText('Currency')) as HTMLSelectElement[];
}

async function getAmountInputs() {
  const inputs = (await screen.findAllByLabelText(
    'Amount'
  )) as HTMLInputElement[];

  const editable = inputs.find((input) => !input.readOnly);
  const readonly = inputs.find((input) => input.readOnly);

  if (!editable || !readonly) {
    throw new Error('Expected editable and readonly amount inputs');
  }

  return { editable, readonly };
}

async function waitForConvertedAmount(expectedAmount: string) {
  await waitFor(async () => {
    const { readonly } = await getAmountInputs();
    expect(readonly.value).toBe(expectedAmount);
  });
}

describe('CurrencyConverterPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows loading state while currencies are loading', async () => {
    let resolveCurrenciesRequest: (response: Response) => void;

    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = new URL(input.toString());

        if (url.pathname.endsWith('/Currency')) {
          return new Promise<Response>((resolve) => {
            resolveCurrenciesRequest = resolve;
          });
        }

        return Promise.resolve(createJsonResponse([], false, 404));
      })
    );

    render(<CurrencyConverterPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    resolveCurrenciesRequest!(createJsonResponse(currenciesDto));
  });

  it('shows server error when initial currencies request fails', async () => {
    mockFailedCurrenciesApi();

    render(<CurrencyConverterPage />);

    expect(
      await screen.findByText(/server error: failed to fetch currencies: 500/i)
    ).toBeInTheDocument();
  });

  it('renders success state after currencies and prices are loaded from API', async () => {
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    const [fromSelect, toSelect] = await getCurrencySelects();
    const { editable, readonly } = await getAmountInputs();

    expect(fromSelect.value).toBe('PLN');
    expect(toSelect.value).toBe('JPY');
    expect(editable.value).toBe('1');

    await waitFor(() => {
      expect(readonly.value).toBe(
        priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
      );
    });

    expect(screen.getByText(/1 polish zloty is/i)).toBeInTheDocument();
    expect(screen.getByText(/japanese yen/i)).toBeInTheDocument();
  });

  it('recalculates result when amount changes', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const { editable, readonly } = await getAmountInputs();

    await user.clear(editable);
    await user.type(editable, '2');

    expect(readonly.value).toBe(
      (2 * priceChangesByPair['PLN-JPY'][0].price).toFixed(2)
    );
  });

  it('recalculates result when currency pair changes', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const [fromSelect] = await getCurrencySelects();

    await user.selectOptions(fromSelect, 'CAD');

    await waitForConvertedAmount(
      priceChangesByPair['CAD-JPY'][0].price.toFixed(2)
    );

    const { readonly } = await getAmountInputs();
    expect(readonly.value).toBe(
      priceChangesByPair['CAD-JPY'][0].price.toFixed(2)
    );
  });

  it('prevents same currency in both selects when changing to-currency', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const [, toSelect] = await getCurrencySelects();

    await user.selectOptions(toSelect, 'PLN');

    const [fromSelect, updatedToSelect] = await getCurrencySelects();

    expect(updatedToSelect.value).toBe('PLN');
    expect(fromSelect.value).not.toBe('PLN');

    await waitForConvertedAmount(
      priceChangesByPair['CAD-PLN'][0].price.toFixed(2)
    );
  });

  it('prevents same currency in both selects when changing from-currency', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const [fromSelect] = await getCurrencySelects();

    await user.selectOptions(fromSelect, 'JPY');

    const [updatedFromSelect, toSelect] = await getCurrencySelects();

    expect(updatedFromSelect.value).toBe('JPY');
    expect(toSelect.value).not.toBe('JPY');

    await waitForConvertedAmount(
      priceChangesByPair['JPY-PLN'][0].price.toFixed(2)
    );
  });

  it('swaps currencies and recalculates result', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const swapButton = screen.getByRole('button', { name: /swap/i });

    await user.click(swapButton);

    const [fromSelect, toSelect] = await getCurrencySelects();

    expect(fromSelect.value).toBe('JPY');
    expect(toSelect.value).toBe('PLN');

    await waitForConvertedAmount(
      priceChangesByPair['JPY-PLN'][0].price.toFixed(2)
    );
  });

  it('resets MoreAboutPair open state when currency pair changes', async () => {
    const user = userEvent.setup();
    mockSuccessfulApi();

    render(<CurrencyConverterPage />);

    await waitForConvertedAmount(
      priceChangesByPair['PLN-JPY'][0].price.toFixed(2)
    );

    const toggleButton = screen.getByRole('button', {
      name: /pln\/jpy: about/i
    });

    await user.click(toggleButton);

    expect(
      screen.getByText('The official currency of Poland.')
    ).toBeInTheDocument();

    const [fromSelect] = await getCurrencySelects();

    await user.selectOptions(fromSelect, 'CAD');

    expect(
      await screen.findByRole('button', {
        name: /cad\/jpy: about/i
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('The official currency of Poland.')
    ).not.toBeInTheDocument();
  });

  it('does not crash when prices request fails after currencies were loaded', async () => {
    mockFailedPricesApi();

    render(<CurrencyConverterPage />);

    const [fromSelect, toSelect] = await getCurrencySelects();
    const { editable, readonly } = await getAmountInputs();

    expect(fromSelect.value).toBe('PLN');
    expect(toSelect.value).toBe('JPY');
    expect(editable.value).toBe('1');
    expect(readonly.value).toBe('0.00');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /we could not update the exchange rate/i
    );
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
});
