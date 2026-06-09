import { useState } from 'react';
import type { CurrencyConverterData } from '../../shared/types/currency.tsx';
import styles from './ConverterCard.module.scss';
import { PairSummary } from '../PairSummary/PairSummary.tsx';
import { CurrencyInputRow } from '../CurrencyInputRow/CurrencyInputRow.tsx';
import { RateDivider } from '../RateDivider/RateDivider.tsx';
import { MoreAboutPair } from '../MoreAboutPair/MoreAboutPair.tsx';

type Props = {
  data: CurrencyConverterData;
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (code: string) => void;
  onToCurrencyChange: (code: string) => void;
  onSwap: () => void;
};

export function ConverterCard({
  data,
  onAmountChange,
  onFromCurrencyChange,
  onToCurrencyChange,
  onSwap
}: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  return (
    <section className={styles.Card}>
      <PairSummary
        headline={data.headline}
        result={data.result}
        updatedAt={data.updatedAt}
      />

      <div className={styles.form}>
        <CurrencyInputRow
          amount={data.topRow.amount}
          currencyCode={data.topRow.currencyCode}
          options={data.topRow.options}
          onAmountChange={onAmountChange}
          onCurrencyChange={onFromCurrencyChange}
        />

        <button type="button" className={styles.swapButton} onClick={onSwap}>
          ⇄ Swap
        </button>

        <CurrencyInputRow
          amount={data.bottomRow.amount}
          currencyCode={data.bottomRow.currencyCode}
          options={data.bottomRow.options}
          onCurrencyChange={onToCurrencyChange}
          readOnly
        />
      </div>

      <RateDivider
        label={data.pairLabel}
        isOpen={isDetailsOpen}
        onClick={() => setIsDetailsOpen((prev) => !prev)}
      />

      {isDetailsOpen && (
        <MoreAboutPair
          key={data.pairLabel}
          pairLabel={`More about ${data.pairLabel}`}
          infoBlocks={data.infoBlocks}
        />
      )}
    </section>
  );
}
