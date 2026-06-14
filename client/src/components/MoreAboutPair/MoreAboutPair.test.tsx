import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  it('renders toggle button with pair label and is closed by default', () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    expect(
      screen.getByRole('button', { name: /more about pln\/jpy/i })
    ).toBeInTheDocument();

    expect(screen.queryByText('Polish Zloty - PLN - zł')).not.toBeInTheDocument();
    expect(screen.queryByText('Official currency of Poland')).not.toBeInTheDocument();
    expect(screen.queryByText('Japanese Yen - JPY - ¥')).not.toBeInTheDocument();
    expect(screen.queryByText('Official currency of Japan')).not.toBeInTheDocument();
  });

  it('shows currency titles and descriptions after click', () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    const button = screen.getByRole('button', {
      name: /more about pln\/jpy/i
    });

    fireEvent.click(button);

    expect(screen.getByText('Polish Zloty - PLN - zł')).toBeInTheDocument();
    expect(screen.getByText('Official currency of Poland')).toBeInTheDocument();

    expect(screen.getByText('Japanese Yen - JPY - ¥')).toBeInTheDocument();
    expect(screen.getByText('Official currency of Japan')).toBeInTheDocument();
  });

  it('hides content after second click', () => {
    render(<MoreAboutPair pairLabel="PLN/JPY" infoBlocks={infoBlocks} />);

    const button = screen.getByRole('button', {
      name: /more about pln\/jpy/i
    });

    fireEvent.click(button);
    expect(screen.getByText('Polish Zloty - PLN - zł')).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText('Polish Zloty - PLN - zł')).not.toBeInTheDocument();
    expect(screen.queryByText('Official currency of Poland')).not.toBeInTheDocument();
  });

  it('renders title without symbol if symbol is empty', () => {
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

    fireEvent.click(
      screen.getByRole('button', { name: /more about usd\/eur/i })
    );

    expect(screen.getByText('US Dollar - USD')).toBeInTheDocument();
    expect(
      screen.queryByText('US Dollar - USD - ')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('Currency of the United States')
    ).toBeInTheDocument();
  });
});