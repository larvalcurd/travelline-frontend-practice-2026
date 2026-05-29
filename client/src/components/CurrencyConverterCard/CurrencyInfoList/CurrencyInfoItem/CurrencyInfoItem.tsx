import styles from './CurrencyInfoItem.module.css';

type CurrencyInfoItemProps = {
  title: string;
  code: string;
  symbol: string;
  description: string;
};

export function CurrencyInfoItem({ title, code, symbol, description }: CurrencyInfoItemProps) {
  return (
    <article className={styles.item}>
      <h3 className={styles.title}>
        {title} - {code} - {symbol}
      </h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
