import styles from './CurrencyConverterPage.module.scss';
import { currencyConverterData } from './currencyConverterData';
import { ConverterCard } from '../../components/ConverterCard/ConverterCard';

export function CurrencyConverterPage() {
    return (
        <main className={styles.page}>
            <ConverterCard data={currencyConverterData} />
        </main>
    );
}
