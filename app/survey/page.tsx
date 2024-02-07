import styles from './page.module.css'
import {Roboto} from "next/font/google";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export default function Survey() {
    return <>
        <form className={styles.form}>
            <div>
                <h1>Just one more thing</h1>
                <h2 className={roboto.className}>Who are you?</h2>
            </div>
            <section>
                <label className={styles.singleFieldInput}>
                    <span>Years of general coding experience:</span>
                    <input type={"number"} min={0} max={100} required/>
                </label>
            </section>

            <section>
                <label className={styles.singleFieldInput}>
                    <span>Years of professional coding experience:</span>
                    <input type={"number"} min={0} max={100} required/>
                </label>
            </section>

            <section className={styles.radio}>
                <p>Did you used generative AI-tools like shown before?</p>
                <div>
                    <label>
                        <input type={"radio"} value={"no"} name={"ai-usage"}/>
                        <span>No</span>
                    </label>
                    <label>
                        <input type={"radio"} value={"yes"} name={"ai-usage"}/>
                        <span>Yes</span>
                    </label>
                </div>
            </section>

            <section className={styles.radio}>
                <p>How often do you use them currently?</p>
                <div>
                    <label>
                        <input type={"radio"} value={"no"} name={"ai-current-usage"}/>
                        <span>Never</span>
                    </label>
                    <label>
                        <input type={"radio"} value={"yes"} name={"ai-current-usage"}/>
                        <span>Rarely</span>
                    </label>
                    <label>
                        <input type={"radio"} value={"no"} name={"ai-current-usage"}/>
                        <span>Often</span>
                    </label>
                    <label>
                        <input type={"radio"} value={"no"} name={"ai-current-usage"}/>
                        <span>Daily</span>
                    </label>
                </div>
            </section>

            <button type={"submit"}>Show my results</button>
        </form>
    </>
}
