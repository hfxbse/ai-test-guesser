'use client'

import AnswerPicker from "./answer-picker";
import styles from './page.module.css'
import {useEffect, useState} from "react";
import {Gist} from "@/app/quiz/gists/route";
import arrayShuffle from "array-shuffle";
import {BarLoader} from "react-spinners";
import {Roboto} from "next/font/google";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export default function Quiz() {
    const [gists, setGists] = useState<Gist[]>([])

    useEffect(() => {
        fetch("/quiz/gists").then(async (response) => {
            if (response.ok || response.status === 304) {
                setGists(arrayShuffle(await response.json()));
            }
        })
    }, []);

    if (gists.length === 0) {
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
        </div>
    }

    const gist = gists[0];

    return <div className={styles.page}>
        <div className={styles.snippets}>
            {
                arrayShuffle(gist.filenames).map(file => <AnswerPicker
                    id={gist.id}
                    username={gist.github_username}
                    file={file}
                    key={file}
                />)
            }
        </div>
        <div>
            <button>Continue to next question</button>
        </div>
    </div>
}
