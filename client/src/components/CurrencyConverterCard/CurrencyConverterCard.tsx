import { useState } from 'react';
import { ConverterForm } from './ConverterForm/ConverterForm';
import { CurrencyInfoItem } from './CurrencyInfoList/CurrencyInfoItem/CurrencyInfoItem';
import styles from './CurrencyConverterCard.module.css';

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

export function CurrencyConverterCard() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);

  return (
    // изменяемые данные передавать с главного компонента
    <main className={styles.card}>
      <section className={styles.headerSection}>
        <h1 className={styles.mainTitle}>1 Polish zloty is</h1>
        <p className={styles.result}>0.99 Japanese yen</p>
        <time className={styles.time}>Fri, 05 Apr 2026 10:35 UTC</time>
      </section>

      <ConverterForm />
      // вынести в компонент
      <div className={styles.dividerContainer}>
        <hr className={styles.divider} />
        // сделать, чтобы кнопка работала
        <button className={styles.toggleButton} onClick={() => setIsDetailsOpen((isDetailsOpen) => !isDetailsOpen)}>
          PLN/JPY: about {isDetailsOpen ? '↑' : '↓'}
        </button>
      </div>

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
