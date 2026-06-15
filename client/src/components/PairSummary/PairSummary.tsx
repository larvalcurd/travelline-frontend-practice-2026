import styles from './PairSummary.module.scss';

type PairSummaryProps = {
  headline: string;
  result: string;
  updatedAt: string;
};

export const PairSummary = ({ headline, result, updatedAt }: PairSummaryProps) => {
  return (
    <header className={styles.summary}>
      <p className={styles.headline}>{headline}</p>
      <h1 className={styles.result}>{result}</h1>
      <p className={styles['updated-at']}>{updatedAt}</p>
    </header>
  );
};
