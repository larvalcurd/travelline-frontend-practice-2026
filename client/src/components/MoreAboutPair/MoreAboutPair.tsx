import type { CurrencyInfo } from '../../shared/types/currency';
import styles from './MoreAboutPair.module.scss';
import { CurrencyInfoBlock } from '../CurrencyInfoBlock/CurrencyInfoBlock';
import { useState } from 'react';
import { RateDivider } from '../RateDivider/RateDivider';

type MoreAboutPairProps = {
  pairLabel: string;
  infoBlocks: CurrencyInfo[];
};

/*
Компонент MoreAboutPair хранит собственное локальное состояние открытия/закрытия
При смене валютной пары нужно сбросить это состояние к начальному значению

для этого используется key:

- при изменении пары меняется pairLabel
- вместе с ним меняется key
- React размонтирует старый компонент и монтирует новый
- локальное состояние дочернего компонента автоматически сбрасывается

это удобный способ сбросить внутренний `state` дочернего компонента без дополнительных reset-пропсов
*/

export const MoreAboutPair = ({
  pairLabel,
  infoBlocks
}: MoreAboutPairProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={styles['more-about']}>
      <RateDivider
        label={`${pairLabel}: about`}
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
