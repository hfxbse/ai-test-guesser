import styles from './answer-picker.module.css'
import 'material-symbols'
import {Roboto} from "next/font/google";
import RatingSelector from "@/app/components/rating-selector";
import dynamic from "next/dynamic";
import {ComponentType} from "react";

const roboto = Roboto({weight: "400", subsets: ["latin"]})

export enum TestCategory {
    FLUTTER_HUMAN = "reference.dart",
    FLUTTER_COPILOT = "copilot.dart",
    FLUTTER_WELLTESTED = "welltested.dart"
}

export default function AnswerPicker({id, username = "hfxbse", category}: {
    id: string,
    username?: string,
    category: TestCategory,
}) {
    const Gist: ComponentType<{
        id: string,
        file: string,
        username: string
    }> = dynamic(() => import('./gist'), {ssr: false})

    const iconClassName = `${styles.icon} material-symbols-outlined`;

    return <div className={styles.card}>
        <div>
            <Gist file={category} id={id} username={username}/>
            <div className={styles.categorySelection}>
                <label>
                    <input
                        tabIndex={0}
                        type="radio"
                        name={`${id}.${category}.guess}`}
                        value={TestCategory.FLUTTER_HUMAN}
                    />
                    <span>
                    <span className={iconClassName}>person</span>
                    <span>Human</span>
                </span>
                </label>
                <label>
                    <input
                        tabIndex={0}
                        type="radio"
                        name={`${id}.${category}.guess}`}

                        value={TestCategory.FLUTTER_COPILOT}/>
                    <span>
                    <span className={iconClassName}>cognition</span>
                    <span>Copilot</span>
                </span>
                </label>
                <label>
                    <input
                        tabIndex={0}
                        type="radio"
                        name={`${id}.${category}.guess}`}
                        value={TestCategory.FLUTTER_WELLTESTED}
                    />
                    <span>
                    <span className={iconClassName}>manufacturing</span>
                    <span>AI generated</span>
                </span>
                </label>
            </div>
        </div>
        <textarea className={styles.freeText} placeholder={"Any additional thought or comments?"} maxLength={500}/>
        <div className={styles.ratingPicker}>
            <span className={roboto.className}>Overall rating:</span>
            <RatingSelector/>
        </div>
    </div>
}
