import { describe, expect, it } from 'vitest';
import { mapPriceChange } from './mapPriceChange';
import type { PriceChangeDto } from '../dto/PriceChangeDto';
import type { PriceChange } from '../../models/PriceChange';

describe('mapPriceChange', () => {
  it('maps PriceChangeDto to PriceChange client model', () => {
    const dto: PriceChangeDto = {
      purchasedCurrencyCode: 'JPY',
      paymentCurrencyCode: 'CAD',
      price: 0.741,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    };

    const expected: PriceChange = {
      purchasedCurrencyCode: 'JPY',
      paymentCurrencyCode: 'CAD',
      price: 0.741,
      dateTime: '2026-05-21T03:40:54.2709677Z'
    };

    expect(mapPriceChange(dto)).toEqual(expected);
  });

  it('returns a new object instead of reusing DTO reference', () => {
    const dto: PriceChangeDto = {
      purchasedCurrencyCode: 'PLN',
      paymentCurrencyCode: 'JPY',
      price: 37.42,
      dateTime: '2026-05-22T10:15:00.0000000Z'
    };

    const result = mapPriceChange(dto);

    expect(result).toEqual({
      purchasedCurrencyCode: 'PLN',
      paymentCurrencyCode: 'JPY',
      price: 37.42,
      dateTime: '2026-05-22T10:15:00.0000000Z'
    });

    expect(result).not.toBe(dto);
  });

  it('does not add fields that are not part of PriceChange client model', () => {
    const dto = {
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 2.75,
      dateTime: '2026-05-23T12:30:00.0000000Z',
      serverOnlyField: 'this field must not leak to UI model'
    } satisfies PriceChangeDto & { serverOnlyField: string };

    const result = mapPriceChange(dto);

    expect(result).toEqual({
      purchasedCurrencyCode: 'CAD',
      paymentCurrencyCode: 'PLN',
      price: 2.75,
      dateTime: '2026-05-23T12:30:00.0000000Z'
    });

    expect(result).not.toHaveProperty('serverOnlyField');
  });
});
