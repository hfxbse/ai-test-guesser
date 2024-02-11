'use client'

import AnswerPicker, {AnswerState} from "./answer-picker";
import styles from './page.module.css'
import {useEffect, useRef, useState} from "react";
import {Gist} from "@/app/quiz/gists/route";
import arrayShuffle from "array-shuffle";
import {BarLoader} from "react-spinners";
import {Roboto} from "next/font/google";
import {useRouter} from "next/navigation";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

interface QuizResponse {
    gist_id: string,
    gist_user: string,
    files: {
        file: string,
        answer: AnswerState
    }[]
}

function useGists() {
    const [gists, setGists] = useState<Gist[]>([])

    useEffect(() => {
        fetch("/quiz/gists").then(async (response) => {
            if (response.ok || response.status === 304) {
                setGists(arrayShuffle(await response.json()));
            }
        })
    }, []);

    return {gists, setGists}
}

function useQuizResponses() {
    const [currentAnswers, setCurrentAnswers] = useState<Record<string, AnswerState>>({})

    function updateAnswer(file: string, answers: AnswerState) {
        setCurrentAnswers({
            ...currentAnswers,
            [file]: answers
        })
    }

    const responses = useRef<QuizResponse[]>([])

    function saveResponse(gist_id: string, gist_user: string) {
        responses.current.push({
            gist_id,
            gist_user,
            files: Object.entries(currentAnswers).map(([file, answer]) => {
                return {
                    file,
                    answer
                }
            })
        })

        setCurrentAnswers({})
    }

    return {answers: currentAnswers, updateAnswer, responses, saveResponse}
}

function placeholder() {
    return <div className={styles.placeholder}>
        <div>
            <h1 className={roboto.className}>Fetching code snippets…</h1>

            <BarLoader
                color={"var(--color-primary)"}
                cssOverride={{
                    background: "inherit",
                }}
            />
        </div>
    </div>;
}

export default function Quiz() {
    const {gists, setGists} = useGists()
    const {answers, updateAnswer, saveResponse} = useQuizResponses()
    const router = useRouter()
    const page = useRef<HTMLDivElement>(null)

    if (gists.length === 0) {
        return placeholder()
    }

    let gist = gists[0];

    function proceedQuiz() {
        saveResponse(gist.id, gist.gist_user)

        if (gists.length > 1) {
            setGists(gists.slice(1))
            page.current?.scrollTo({top: 0, left: 0, behavior: 'instant'})
        } else {
            router.push('/survey')
        }
    }

    function answerIssue(): string | null {
        const values = Object.values(answers);

        let completed = values.length === gist.filenames.length;
        completed &&= values.find(answer => answer.guess === null || answer.rating === null) === undefined

        if (!completed) {
            return 'Please add a guess to all code snippets and rate each of them.'
        }

        const duplicates = new Set(values.map(answer => answer.guess)).size < values.length

        if (duplicates) {
            return 'Each guess category can be assigned to only one snippet.'
        }

        return null
    }

    const issue = answerIssue();
    const interacted = Object.keys(answers).length > 0;

    return <div className={styles.page} ref={page}>
        <div className={styles.snippets}>
            {
                gist.filenames.map((file) => <AnswerPicker
                    key={gist.gist_user + gist.id + file}

                    gistId={gist.id}
                    gistUsername={gist.gist_user}
                    gistFile={file}

                    answer={answers[file] ?? {rating: null, text: null, guess: null}}
                    setAnswer={answer => updateAnswer(file, answer)}
                />)
            }
        </div>
        <div>
            <div>
                <span className={styles.issue}>{interacted && issue !== null ? issue : ''}</span>
                <button onClick={proceedQuiz} disabled={issue !== null}>Continue to next question</button>
            </div>
        </div>
    </div>
}
