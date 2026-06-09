import styles from './CurrencyInputRow.module.css';

type CurrencyInputRowProps = {
  value: string;
  currencyCode: string;
};

export function CurrencyInputRow({
  value,
  currencyCode
}: CurrencyInputRowProps) {
  return (
    <div className={styles.row}>
      <input
        type="text"
        className={styles.input}
        defaultValue={value}
        readOnly
      />
      <div className={styles.selectWrapper}>
        // список передать в пропсах
        <select className={styles.select} value={currencyCode}>
          <option value="PLN">PLN</option>
          <option value="JPY">JPY</option>
        </select>
        <span className={styles.arrow}>▼</span>
      </div>
    </div>
  );
}
