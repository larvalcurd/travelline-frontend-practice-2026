import styles from './CurrencyInfoBlock.module.scss';

type CurrencyInfoBlockProps = {
  title: string;
  description: string;
};

export const CurrencyInfoBlock = ({ title, description }: CurrencyInfoBlockProps) => {
  return (
    <article className={styles.block}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </article>
  );
};
