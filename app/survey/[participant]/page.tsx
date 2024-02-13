import styles from './page.module.css'
import {Roboto} from "next/font/google";
import uuidToBuffer from "@/app/uuidToBuffer";
import {permanentRedirect, redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
import {Metadata} from "next";
import {metadata as layoutMeta} from "@/app/layout";

const roboto = Roboto({weight: "300", subsets: ["latin"]})

export const metadata: Metadata = {
    title: `Post quiz survey - ${layoutMeta.title}`,
}

export const runtime = 'edge';

export default async function Survey({params}: { params: { participant: string } }) {
    const uuid = params.participant

    async function checkParticipant() {
        "use server"

        const participantUUID = uuidToBuffer(uuid)

        const db = process.env.DB

        const participant = await db.prepare(
            "SELECT 1 FROM participants WHERE uuid = ?1"
        ).bind(participantUUID).first()

        if (participant === null) redirect('/')

        const survey = await db.prepare(
            "SELECT 1 FROM surveys WHERE participant_uuid = ?1"
        ).bind(participantUUID).first()

        if (survey !== null) {
            permanentRedirect(`/results/${params.participant}`)
        }
    }

    async function saveSurvey(response: FormData) {
        "use server"

        const db = process.env.DB

        await db.prepare(`
            INSERT INTO surveys (participant_uuid,
                                 experience_coding,
                                 experience_professional,
                                 ai_use_before,
                                 ai_use_current)
            VALUES (?1, ?2, ?3, ?4, ?5)`
        ).bind(
            uuidToBuffer(uuid),
            response.get("experienceCoding"),
            response.get("experienceProfessional"),
            response.get("aiUseBefore"),
            response.get("aiUseCurrent"),
        ).raw()

        revalidatePath(`/survey/${uuid}`)
    }

    await checkParticipant()

    function createRadios(name: string, options: { value: string, label: string }[]) {
        return options.map(option =>
            <label key={option.value}>
                <input type={"radio"} value={option.value} name={name} required/>
                <span>{option.label}</span>
            </label>
        )
    }

    return <>
        <form className={styles.form} action={saveSurvey}>
            <div>
                <h1>Just one more thing</h1>
                <h2 className={roboto.className}>Who are you?</h2>
            </div>
            <section>
                <label className={styles.singleFieldInput}>
                    <span>Years of general coding experience:</span>
                    <input type={"number"} min={0} max={150} required name={"experienceCoding"}/>
                </label>
            </section>

            <section>
                <label className={styles.singleFieldInput}>
                    <span>Years of professional coding experience:</span>
                    <input type={"number"} min={0} max={150} required name={"experienceProfessional"}/>
                </label>
            </section>

            <section className={styles.radio}>
                <p>Did you used generative AI-tools like shown before?</p>
                <div>
                    {
                        createRadios("aiUseBefore", [
                            {value: 'yes', label: 'Yes'},
                            {value: 'no', label: 'No'},
                        ])
                    }
                </div>
            </section>

            <section className={styles.radio}>
                <p>How often do you use them currently?</p>
                <div>
                    {
                        createRadios("aiUseCurrent", [
                            {value: 'never', label: 'Never'},
                            {value: 'rarely', label: 'Rarely'},
                            {value: 'often', label: 'Often'},
                            {value: 'daily', label: 'Daily'},
                        ])
                    }
                </div>
            </section>

            <button type={"submit"}>Show my results</button>
        </form>
    </>
}
