import type { CurrencyInfo } from '../../shared/types/currency';
import styles from './MoreAboutPair.module.scss';
import { CurrencyInfoBlock } from '../CurrencyInfoBlock/CurrencyInfoBlock';

type Props = {
    pairLabel: string;
    infoBlocks: CurrencyInfo[];
};

export function MoreAboutPair({ pairLabel, infoBlocks }: Props) {
    return (
        <section className={styles.moreAbout} aria-labelledby="more-about-title">
            <h2 id="more-about-title" className={styles.title}>
                {pairLabel}
            </h2>

            <div className={styles.blocks}>
                {infoBlocks.map((block) => (
                    <CurrencyInfoBlock
                        key={block.title}
                        title={block.title}
                        description={block.description}
                    />
                ))}
            </div>
        </section>
    );
}
