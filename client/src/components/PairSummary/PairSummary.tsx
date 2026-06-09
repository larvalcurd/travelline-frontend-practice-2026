import styles from './PairSummary.module.scss';

type Props = {
  headline: string;
  result: string;
  updatedAt: string;
};

export function PairSummary({ headline, result, updatedAt }: Props) {
  return (
    <header className={styles.summary}>
      <p className={styles.headline}>{headline}</p>
      <h1 className={styles.result}>{result}</h1>
      <p className={styles.updatedAt}>{updatedAt}</p>
    </header>
  );
}
