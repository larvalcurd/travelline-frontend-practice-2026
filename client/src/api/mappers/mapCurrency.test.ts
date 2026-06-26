import { describe, expect, it } from 'vitest';
import { mapCurrency } from './mapCurrency';
import type { CurrencyDto } from '../dto/CurrencyDto';
import type { Currency } from '../../models/Currency';

describe('mapCurrency', () => {
  it('maps CurrencyDto to Currency client model', () => {
    const dto: CurrencyDto = {
      code: 'PLN',
      name: 'Polish Zloty',
      description: 'The official currency of Poland.',
      symbol: 'zł'
    };

    const expected: Currency = {
      code: 'PLN',
      name: 'Polish Zloty',
      description: 'The official currency of Poland.',
      symbol: 'zł'
    };

    expect(mapCurrency(dto)).toEqual(expected);
  });

  it('returns a new object instead of reusing DTO reference', () => {
    const dto: CurrencyDto = {
      code: 'JPY',
      name: 'Japanese Yen',
      description: 'The official currency of Japan.',
      symbol: '¥'
    };

    const result = mapCurrency(dto);

    expect(result).toEqual({
      code: 'JPY',
      name: 'Japanese Yen',
      description: 'The official currency of Japan.',
      symbol: '¥'
    });

    expect(result).not.toBe(dto);
  });

  it('does not add fields that are not part of Currency client model', () => {
    const dto = {
      code: 'CAD',
      name: 'Canadian Dollar',
      description: 'The official currency of Canada.',
      symbol: '$',
      serverOnlyField: 'this field must not leak to UI model'
    } satisfies CurrencyDto & { serverOnlyField: string };

    const result = mapCurrency(dto);

    expect(result).toEqual({
      code: 'CAD',
      name: 'Canadian Dollar',
      description: 'The official currency of Canada.',
      symbol: '$'
    });

    expect(result).not.toHaveProperty('serverOnlyField');
  });
});
