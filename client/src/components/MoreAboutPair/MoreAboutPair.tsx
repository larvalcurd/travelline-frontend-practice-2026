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
        {infoBlocks.map((block) => {
          const blockTitle = block.symbol
            ? `${block.title} - ${block.code} - ${block.symbol}`
            : `${block.title} - ${block.code}`;

          return (
            <CurrencyInfoBlock
              key={block.code}
              title={blockTitle}
              description={block.description}
            />
          );
        })}
      </div>
    </section>
  );
}
