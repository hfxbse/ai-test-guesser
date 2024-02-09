import styles from "./rating-selector.module.css";
import {useState} from "react";

import 'material-symbols'

export default function RatingSelector({disabled = false, rating = 0, onChange}: {
    disabled?: boolean,
    rating?: number,
    onChange?: (rating: number) => void
}) {
    const materialSymbolsOutlined = "material-symbols-outlined";
    const [ratingState, setRatingState] = useState(rating)

    function setRating(rating: number) {
        setRatingState(rating)

        if (onChange !== undefined) onChange(rating)
    }

    return <div className={styles.ratingPicker}>
        {
            Array.from(Array(6), (_, index) => {
                const active = index <= (ratingState - 0.5) ? styles.active : '';
                const icon = (ratingState - index) <= 0 || (ratingState - index) > 0.5 ?
                    'grade' :
                    'star_rate_half';

                return <button key={index} onClick={() => setRating(index + 1)} disabled={disabled}>
                    <span className={`${materialSymbolsOutlined} ${active}`}>{icon}</span>
                </button>
            })
        }
    </div>
}
