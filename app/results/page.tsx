'use client'

import {Roboto} from "next/font/google";
import styles from './page.module.css'
import ResultEntry from "@/app/results/result-entry";
import RatingSelector from "@/app/components/rating-selector";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export default function Results() {
    return <div className={styles.page}>
        <div>
            <h1>Your results</h1>
        </div>
        <div>
            <h2 className={roboto.className}>How often did you identify the tool correctly?</h2>
            <div className={styles.certainty}>
                <ResultEntry title={"No AI tools"} percentage={45} average={90}/>
                <ResultEntry title={"GitHub Copilot"} percentage={20.32003} average={90}/>
                <ResultEntry title={"Fully AI generated"} percentage={100} average={90}/>
            </div>
        </div>
        <div>
            <h2 className={roboto.className}>Which tests did you like the most on average?</h2>
            <div className={styles.ratings}>
                <h3>No AI tools</h3>
                <RatingSelector rating={3.5} disabled={true}/>
            </div>
            <div className={styles.ratings}>
                <h3>GitHub Copilot</h3>
                <RatingSelector rating={1} disabled={true}/>
            </div>
            <div className={styles.ratings}>
                <h3>Fully AI generated</h3>
                <RatingSelector rating={5} disabled={true}/>
            </div>
        </div>
    </div>
}
