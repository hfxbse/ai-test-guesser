import styles from './result-entry.module.css'
import {Roboto} from "next/font/google";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export default function ResultEntry({title, percentage, average}: {
    title: string,
    percentage: number,
    average: number,
}) {
    percentage = percentage > 100 ? 100 : percentage;
    percentage = percentage < 0 ? 0 : percentage;

    const radius = percentage < 100 ? "0" : "8px";

    return <div className={styles.entry}>
        <h3>{title}</h3>
        <div className={styles.bar}>
            <div style={{width: `${percentage}%`, borderBottomRightRadius: radius, borderTopRightRadius: radius}}>
                {percentage >= 15 ? `${percentage.toFixed(1)} %` : ''}
            </div>
            <span>{percentage < 85 ? `${(100 - percentage).toFixed(1)} %` : ''}</span>
        </div>
        <p className={roboto.className}>Other users identify it {average.toFixed(1)} % of the time.</p>
    </div>
}
