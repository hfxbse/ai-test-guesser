import uuidToBuffer from "@/app/uuidToBuffer";
import {redirect} from "next/navigation";

export default async function loadResults(uuid: string) {
    "use server"

    const db = process.env.DB

    const participantUUID = uuidToBuffer(uuid)

    const participant = await db.prepare(
        "SELECT 1 FROM participants WHERE uuid = ?1"
    ).bind(participantUUID).first()

    if (participant === null) redirect('/')

    function readResults(result: D1Result) {
        if (result.error !== undefined) throw result.error

        const fields = result.results[0] as {
            ratingHuman?: number,
            ratingCopilot?: number,
            ratingAiGenerated?: number,
            certaintyHuman: number,
            certaintyCopilot: number,
            certaintyAiGenerated: number,
        }

        const percentages = {
            human: fields.certaintyHuman * 100,
            copilot: fields.certaintyCopilot * 100,
            aiGenerated: fields.certaintyAiGenerated * 100
        }

        let noUndefined = fields.certaintyHuman !== undefined
        noUndefined = noUndefined && fields.certaintyCopilot !== undefined
        noUndefined = noUndefined && fields.certaintyAiGenerated !== undefined

        if (noUndefined) {
            return {
                percentages,
                ratings: {
                    human: fields.ratingHuman,
                    copilot: fields.ratingCopilot,
                    aiGenerated: fields.ratingAiGenerated
                }
            }
        }

        return {percentages}
    }

    const results = await db.batch([
        // participant responses
        db.prepare(`
            SELECT AVG(human.rating)                                                    AS ratingHuman,
                   AVG(copilot.rating)                                                  AS ratingCopilot,
                   AVG(ai_generated.rating)                                             AS ratingAiGenerated,
                   AVG(CASE WHEN human.guess = 'human' THEN 1 ELSE 0 END)               AS certaintyHuman,
                   AVG(CASE WHEN copilot.guess = 'copilot' THEN 1 ELSE 0 END)           AS certaintyCopilot,
                   AVG(CASE WHEN ai_generated.guess = 'ai-generated' THEN 1 ELSE 0 END) AS certaintyAiGenerated
            FROM quiz_responses
                     LEFT JOIN snippet_responses AS human ON quiz_responses.response_human = human.id
                     LEFT JOIN snippet_responses AS copilot ON quiz_responses.response_copilot = copilot.id
                     LEFT JOIN snippet_responses AS ai_generated
                               ON quiz_responses.response_ai_generated = ai_generated.id
            WHERE quiz_responses.participant_uuid = ?1
        `).bind(participantUUID),

        // average responses other participants
        db.prepare(`
            SELECT AVG(CASE WHEN human.guess = 'human' THEN 1 ELSE 0 END)               AS certaintyHuman,
                   AVG(CASE WHEN copilot.guess = 'copilot' THEN 1 ELSE 0 END)           AS certaintyCopilot,
                   AVG(CASE WHEN ai_generated.guess = 'ai-generated' THEN 1 ELSE 0 END) AS certaintyAiGenerated
            FROM quiz_responses
                     LEFT JOIN snippet_responses AS human ON quiz_responses.response_human = human.id
                     LEFT JOIN snippet_responses AS copilot ON quiz_responses.response_copilot = copilot.id
                     LEFT JOIN snippet_responses AS ai_generated
                               ON quiz_responses.response_ai_generated = ai_generated.id
            WHERE quiz_responses.participant_uuid <> ?1
        `).bind(participantUUID),
    ])

    const participantResults = readResults(results.splice(0, 1)[0])
    const averageResults = readResults(results.splice(0, 1)[0])

    return {
        participantResults,
        averageResults
    }
}
