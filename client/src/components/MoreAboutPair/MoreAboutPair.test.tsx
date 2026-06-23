import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoreAboutPair } from './MoreAboutPair';
import type { CurrencyInfo } from '../../shared/types/currency';

const infoBlocks: CurrencyInfo[] = [
  {
    title: 'Polish Zloty',
    code: 'PLN',
    symbol: 'zł',
    description: 'Official currency of Poland'
  },
  {
    title: 'Japanese Yen',
    code: 'JPY',
    symbol: '¥',
    description: 'Official currency of Japan'
  }
];

describe('MoreAboutPair', () => {
  var user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders toggle button with pair label and is closed by default', () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    expect(
      screen.getByRole('button', { name: /pln\/jpy: about/i })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Polish Zloty - PLN - zł')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Official currency of Poland')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Japanese Yen - JPY - ¥')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Official currency of Japan')
    ).not.toBeInTheDocument();
  });

  it('shows currency titles and descriptions after click', async () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    const button = screen.getByRole('button', {
      name: /pln\/jpy: about/i
    });

    await user.click(button);

    expect(screen.getByText('Polish Zloty - PLN - zł')).toBeInTheDocument();
    expect(screen.getByText('Official currency of Poland')).toBeInTheDocument();

    expect(screen.getByText('Japanese Yen - JPY - ¥')).toBeInTheDocument();
    expect(screen.getByText('Official currency of Japan')).toBeInTheDocument();
  });

  it('hides content after second click', async () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    const button = screen.getByRole('button', {
      name: /pln\/jpy: about/i
    });

    await user.click(button);
    expect(screen.getByText('Polish Zloty - PLN - zł')).toBeInTheDocument();

    await user.click(button);
    expect(
      screen.queryByText('Polish Zloty - PLN - zł')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Official currency of Poland')
    ).not.toBeInTheDocument();
  });

  it('renders title without symbol if symbol is empty', async () => {
    const blocksWithoutSymbol: CurrencyInfo[] = [
      {
        title: 'US Dollar',
        code: 'USD',
        symbol: '',
        description: 'Currency of the United States'
      }
    ];

    render(
      <MoreAboutPair pairLabel="USD/EUR" infoBlocks={blocksWithoutSymbol} />
    );

    const button = screen.getByRole('button', { name: /usd\/eur: about/i });
    await user.click(button);

    expect(screen.getByText('US Dollar - USD')).toBeInTheDocument();
    expect(screen.queryByText('US Dollar - USD - ')).not.toBeInTheDocument();
    expect(
      screen.getByText('Currency of the United States')
    ).toBeInTheDocument();
  });
});
