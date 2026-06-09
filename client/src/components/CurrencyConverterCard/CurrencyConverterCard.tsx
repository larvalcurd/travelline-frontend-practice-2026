import { useState } from 'react';
import { ConverterForm } from './ConverterForm/ConverterForm';
import { CurrencyInfoItem } from './CurrencyInfoList/CurrencyInfoItem/CurrencyInfoItem';
import styles from './CurrencyConverterCard.module.css';
import { RateDivider } from '../RateDivider/RateDivider';

type CurrencyData = {
  title: string;
  code: string;
  symbol: string;
  description: string;
};

const CURRENCIES_INFO: CurrencyData[] = [
  {
    title: 'Polish zloty',
    code: 'PLN',
    symbol: 'zł',
    description:
      'This is the official currency and legal tender of Poland. It is subdivided into 100 grosz-y (gr). It is the most traded currency in Central and Eastern Europe and ranks 21st most-traded in the foreign exchange market.'
  },
  {
    title: 'Japanese yen',
    code: 'JPY',
    symbol: '¥',
    description:
      'The yen is the official currency of Japan. It is the third-most traded currency in the foreign exchange market, after the United States dollar and the euro. It is also widely used as a third reserve currency after the US dollar and the euro.'
  }
];

type CurrencyConverterCardProps = {
  rate: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
};

// 1. Принимаем изменяемые данные через props согласно CurrencyConverterCardProps
export function CurrencyConverterCard({
  rate,
  date,
  fromCurrency,
  toCurrency
}: CurrencyConverterCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  const dividerLabel = `${fromCurrency}/${toCurrency}: about`;

  const handleToggleDetails = () => {
    console.log('Клик сработал! Старое состояние:', isDetailsOpen);
    setIsDetailsOpen((prev) => {
      const newState = !prev;
      console.log('Новое состояние записано в State:', newState);
      return newState;
    });
  };

  return (
    <main className={styles.card}>
      <section className={styles.headerSection}>
        {/* Изменяемые данные теперь выводятся динамически */}
        <h1 className={styles.mainTitle}>1 {fromCurrency} is</h1>
        <p className={styles.result}>
          {rate} {toCurrency}
        </p>
        <time className={styles.time} dateTime={date}>
          {date}
        </time>
      </section>

      <ConverterForm />

      {/* 2. Вынесли разделитель с кнопкой в отдельный компонент */}
      <RateDivider
        label={dividerLabel}
        isOpen={isDetailsOpen}
        onClick={handleToggleDetails}
      />

      {isDetailsOpen && (
        <section className={styles.infoSection}>
          {CURRENCIES_INFO.map((currency) => (
            <CurrencyInfoItem
              key={currency.code}
              title={currency.title}
              code={currency.code}
              symbol={currency.symbol}
              description={currency.description}
            />
          ))}
        </section>
      )}
    </main>
  );
}
