import styles from './RateDivider.module.scss';

type Props = {
  label: string;
  isOpen: boolean;
  onClick: () => void;
};

export function RateDivider({ label, isOpen, onClick }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.line} />
      <button type="button" className={styles.badge} onClick={onClick}>
        <span>{label}</span>
        <span
          className={`${styles.arrow} ${!isOpen ? styles.rotated : ''}`}
          aria-hidden="true"
        >
          ↑
        </span>
      </button>
    </div>
  );
}
