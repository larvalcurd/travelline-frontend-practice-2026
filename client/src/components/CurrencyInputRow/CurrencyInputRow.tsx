import type { CurrencyOption } from '../../shared/types/currency';
import styles from './CurrencyInputRow.module.scss';

type Props = {
    amount: string;
    currencyCode: string;
    options: CurrencyOption[];
};

export function CurrencyInputRow({ amount, currencyCode, options }: Props) {
    return (
        <div className={styles.row}>
            <input
                className={styles.amount}
                value={amount}
                readOnly
                aria-label="Amount"
            />

            <select
                className={styles.currency}
                defaultValue={currencyCode}
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
