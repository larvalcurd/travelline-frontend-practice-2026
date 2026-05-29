import styles from './RateDivider.module.scss';

type Props = {
    label: string;
};

export function RateDivider({ label }: Props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.line} />
            <div className={styles.badge}>
                <span>{label}</span>
                <span className={styles.arrow} aria-hidden="true">
                    ↑
                </span>
            </div>
        </div>
    );
}
