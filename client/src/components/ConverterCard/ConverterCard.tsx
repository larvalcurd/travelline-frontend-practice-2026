import type { CurrencyConverterData } from '../../shared/types/currency.tsx';
import styles from './ConverterCard.module.scss';
import { PairSummary } from '../PairSummary/PairSummary.tsx';
import { CurrencyInputRow } from '../CurrencyInputRow/CurrencyInputRow.tsx';
import { RateDivider } from '../RateDivider/RateDivider.tsx';
import { MoreAboutPair } from '../MoreAboutPair/MoreAboutPair.tsx';

type Props = {
    data: CurrencyConverterData;
};

export function ConverterCard({ data }: Props) {
    return (
        <section className={styles.card}>
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
                />

                <CurrencyInputRow
                    amount={data.bottomRow.amount}
                    currencyCode={data.bottomRow.currencyCode}
                    options={data.bottomRow.options}
                />
            </div>

            <RateDivider label={data.pairLabel} />

            <MoreAboutPair pairLabel={data.pairLabel} infoBlocks={data.infoBlocks} />
        </section>
    );
}
