import styles from './answer-picker.module.css'
import 'material-symbols'
import {Roboto} from "next/font/google";
import RatingSelector from "@/app/components/rating-selector";
import {FormEvent} from "react";
import Gist from "@/app/quiz/gist";

const roboto = Roboto({weight: "400", subsets: ["latin"]})

type Guess = null | 'human' | 'copilot' | 'ai-generated'
type Text = null | string
type Rating = null | number

export interface AnswerState {
    guess: Guess
    rating: Rating,
    text: Text
}

interface RadioButton {
    value: Guess,
    label: string,
    icon: string
}

const radios: RadioButton[] = [
    {
        value: 'human',
        icon: 'person',
        label: 'Human'
    },
    {
        value: 'copilot',
        icon: 'cognition',
        label: 'Copilot'
    },
    {
        value: 'ai-generated',
        icon: 'manufacturing',
        label: 'AI generated'
    },
]

export default function AnswerPicker({gistId, gistUsername, gistFile, setAnswer, answer}: {
    gistId: string,
    gistUsername: string,
    gistFile: string,
    answer: AnswerState,
    setAnswer?: (answer: AnswerState) => void
}) {

    function onGuessChange(event: FormEvent) {
        const radio = event.target as HTMLInputElement;
        updateAnswer({guess: radio.value as Guess})
    }

    function onTexChange(event: FormEvent<HTMLTextAreaElement>) {
        const textArea = event.target as HTMLTextAreaElement
        const input = textArea.value.trim()

        updateAnswer({text: input.length > 0 ? input : null})
    }

    function updateAnswer({rating, guess, text}: {
        rating?: undefined | Rating,
        guess?: undefined | Guess,
        text?: undefined | Text,
    }) {
        if (setAnswer !== undefined) setAnswer({
            rating: rating ?? answer.rating,
            guess: guess ?? answer.guess,
            text: text ?? answer.text
        })
    }

    const iconClassName = `${styles.icon} material-symbols-outlined`;
    const radioGroup = `${gistUsername}.${gistId}.${gistFile}.guess}`;

    return <div className={styles.card}>
        <Gist file={gistFile} username={gistUsername} id={gistId}/>
        <div className={styles.categorySelection} onChange={onGuessChange}>
            {
                radios.map(radio =>
                    <label key={radio.value}>
                        <input
                            tabIndex={0}
                            type="radio"
                            name={radioGroup}
                            value={radio.value as string}
                        />
                        <span>
                                <span className={iconClassName}>{radio.icon}</span>
                                <span>{radio.label}</span>
                            </span>
                    </label>
                )
            }
        </div>
        <textarea
            className={styles.freeText}
            placeholder={"Any additional thought or comments?"}
            maxLength={500}
            onChange={onTexChange}
        />
        <div className={styles.ratingPicker}>
            <span className={roboto.className}>Overall rating:</span>
            <RatingSelector onChange={rating => updateAnswer({rating})}/>
        </div>
    </div>
}
