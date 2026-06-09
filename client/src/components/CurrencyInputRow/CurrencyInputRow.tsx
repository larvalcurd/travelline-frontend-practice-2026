import type { CurrencyOption } from '../../shared/types/currency';
import styles from './CurrencyInputRow.module.scss';

type Props = {
  amount: string;
  currencyCode: string;
  options: CurrencyOption[];
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange?: (code: string) => void;
};

export function CurrencyInputRow({
  amount,
  currencyCode,
  options,
  readOnly = false,
  onAmountChange,
  onCurrencyChange
}: Props) {
  return (
    <div className={styles.row}>
      <input
        className={styles.amount}
        value={amount}
        readOnly={readOnly}
        onChange={(e) => onAmountChange?.(e.target.value)}
        aria-label="Amount"
      />

      <select
        className={styles.currency}
        value={currencyCode}
        onChange={(e) => onCurrencyChange?.(e.target.value)}
        aria-label="Currency"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>

      <span className={styles.chevron} aria-hidden="true">
        ▼
      </span>
    </div>
  );
}
