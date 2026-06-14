import styles from './CurrencyInfoBlock.module.scss';

type Props = {
  title: string;
  description: string;
};

export function CurrencyInfoBlock({ title, description }: Props) {
  return (
    <article className={styles.block}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
}
