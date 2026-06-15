import type { CurrencyInfo } from '../../shared/types/currency';
import styles from './MoreAboutPair.module.scss';
import { CurrencyInfoBlock } from '../CurrencyInfoBlock/CurrencyInfoBlock';
import { useState } from 'react';
import { RateDivider } from '../RateDivider/RateDivider';

type MoreAboutPairProps = {
  pairLabel: string;
  infoBlocks: CurrencyInfo[];
};

export const MoreAboutPair = ({ pairLabel, infoBlocks }: MoreAboutPairProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles['more-about']}>
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
};
