import { CurrencyInputRow } from './CurrencyInputRow/CurrencyInputRow';
import styles from './ConverterForm.module.css';

export function ConverterForm() {
  return (
    <form className={styles.form}>
      <CurrencyInputRow value="1" currencyCode="PLN" />
      <CurrencyInputRow value="0,99" currencyCode="JPY" />
    </form>
  );
}
