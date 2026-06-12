import type { CurrencyInfo } from '../../shared/types/currency';
import styles from './MoreAboutPair.module.scss';
import { CurrencyInfoBlock } from '../CurrencyInfoBlock/CurrencyInfoBlock';
import { useState } from 'react';
import { RateDivider } from '../RateDivider/RateDivider';

type Props = {
  pairLabel: string;
  infoBlocks: CurrencyInfo[];
};

export function MoreAboutPair({ pairLabel, infoBlocks }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles.moreAbout}>
      <RateDivider
        label={`More about ${pairLabel}`}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {isOpen && (
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
      )}
    </section>
  );
}