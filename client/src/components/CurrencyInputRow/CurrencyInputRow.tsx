import type { Currency } from '../../shared/types/currency';
import styles from './CurrencyInputRow.module.scss';

type CurrencyInputRowProps = {
  amount: string;
  currencyCode: string;
  options: Currency[];
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onCurrencyChange?: (currency: Currency) => void;
};

export const CurrencyInputRow = ({
  amount,
  currencyCode,
  options,
  readOnly = false,
  onAmountChange,
  onCurrencyChange
}: CurrencyInputRowProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetCurrency = options.find((c) => c.code === e.target.value);
    if (targetCurrency) {
      onCurrencyChange?.(targetCurrency);
    }
  };

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
        onChange={handleSelectChange}
        aria-label="Currency"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code}
          </option>
        ))}
      </select>

      <span className={styles.chevron} aria-hidden="true">
        ▼
      </span>
    </div>
  );
};
