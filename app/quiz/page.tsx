'use client'

import AnswerPicker, {TestCategory} from "@/app/quiz/answer-picker";
import styles from './page.module.css'

export default function Quiz() {
    return <div className={styles.page}>
        <div className={styles.snippets}>
            <AnswerPicker id={"02faf8925f845a6438f9997dfbe579e3"} category={TestCategory.FLUTTER_COPILOT}/>
            <AnswerPicker id={"02faf8925f845a6438f9997dfbe579e3"} category={TestCategory.FLUTTER_WELLTESTED}/>
            <AnswerPicker id={"02faf8925f845a6438f9997dfbe579e3"} category={TestCategory.FLUTTER_HUMAN}/>
        </div>
        <div>
            <button>Continue to next quiz</button>
        </div>
    </div>
}
