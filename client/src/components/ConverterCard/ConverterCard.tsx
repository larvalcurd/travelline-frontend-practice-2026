import type { CurrencyConverterData } from '../../shared/types/currency.tsx';
import styles from './ConverterCard.module.scss';
import { PairSummary } from '../PairSummary/PairSummary.tsx';
import { CurrencyInputRow } from '../CurrencyInputRow/CurrencyInputRow.tsx';
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

      <MoreAboutPair
        key={data.pairLabel}
        pairLabel={data.pairLabel}
        infoBlocks={data.infoBlocks}
      />
    </section>
  );
}
